import React, { Component } from "react";

const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";
let crypt = null;
let privateKey = null;
let publickey = null;

// this class represents all the features for the 'Send an email (Validation Process)' tab
// where the user can send an encrypted email message to another user
class SecureEmailForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return "Anonymous";
        },
        avatarUrl() {
          return avatarFallbackImage;
        }
      },
      username: "",
      email: "",
      pubkeystored: "",
      my_pairs: [],
      statusIndex: 0,
      isLoading: false
    };
  }

  /* validates every single input, and based on these inputs it 
     opens the external mail client that lets the user send an encrypted email message
  */
  sendMail() {
    var topic = document
      .getElementById("topic")
      .value.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var rec_email = document.getElementById("recepient_email").value;
    var message = document.getElementById("message").value;
    var encrypted_message = document.getElementById("crypted").value;
    var email = rec_email.split(" ").join("");
    
    // this is a regex pattern to test all valid email addresses
    const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
    var result = pattern.test(email);

    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };
    if (rec_email == "") {
      alert("You must enter the recepient's email address!");
    } else if (result == false) {
      alert("Invalid email address...");
    } else if (topic == '') {
      alert("Topic can't be empty...");
    } else if (message.trim() == "") {
      alert("Please, enter a message!");
    } else if (encrypted_message.trim() == "") {
      alert(
        "Message must be encrypted with the other peer's public key, before it's sent to this peer!"
      );
    } else {
      var link =
        "mailto:" +
        escape(document.getElementById("recepient_email").value) +
        "?cc=" +
        escape("") +
        "&subject=" +
        escape(document.getElementById("topic").value) +
        "&body=" +
        escape(document.getElementById("crypted").value);
      window.location.href = link;
    }
  }

  /* validates the message (plaintext), and the encrypted message, 
  and lets a peer encrypt a message with another peer's public key based on JSEncrypt module */
  encryptedMsg() {
    var crypt = new JSEncrypt();
    document.getElementById("encryptxbox").checked = false;
    var Msg = document.getElementById("message").value;
    var other_peer_pkey = document.getElementById("pub_other_peer_pkey").value;
    document.getElementById("encryptxbox").checked = false;
    document.getElementById("decryptxbox").disabled = true;
    crypt.setKey(other_peer_pkey);
    if (Msg == "") {
      alert("Can't encrypt an empty message!");
    }
    else if (Msg != "" && crypt.encrypt(Msg) == false) {
      if (other_peer_pkey == "") {
        alert("Encryption failed! The other peer's public key is not defined.");
      }
      else if (
        !(other_peer_pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        other_peer_pkey.trim().endsWith("-----END PUBLIC KEY-----"))
      ) {
        alert("Encryption failed! The other peer's public key is invalid.");
      }
      document.getElementById("crypted").value = "";
    }
    else if (
      !(other_peer_pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
      other_peer_pkey.trim().endsWith("-----END PUBLIC KEY-----"))
    ) {
      alert("Encryption failed! The other peer's public key is invalid.");
    }
    else if (Msg != "" && crypt.encrypt(Msg) != false && other_peer_pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
      other_peer_pkey.trim().endsWith("-----END PUBLIC KEY-----")) {
      document.getElementById("crypted").value = crypt.encrypt(Msg); // encrypts the input message with the JSencrypt module
      document.getElementById("encryptxbox").disabled = true;
      document.getElementById("encryptxbox").checked = true;
    }
  }

  /* validates the encrypted and the decrypted message, blockstack id and password that are required for the decryption, 
  and lets a peer decrypt the encrypted message with the peer's private key based on JSEncrypt module */
  decryptedMsg() {
    var crypt = new JSEncrypt();
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };
    var Msg = document.getElementById("message");
    var email = document.getElementById("email_address").value;
    var pkey = document.getElementById("public_key").value;
    var pass = document.getElementById("passphrase").value;
    var id_user = document
      .getElementById("blockstack_ID")
      .value.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var blockstack_user = document
      .getElementById("user")
      .innerHTML.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var cryptedMsg = document.getElementById("crypted").value;
    var my_prkey = document.getElementById("gen_priv_key").value;
    var decryptedMsg = document.getElementById("decrypted");
    $("#isnotvalid").text("");
    $("#isvalid").text("");
    crypt.setKey(my_prkey);

    if (Msg.readOnly == false) {
      alert("Decryption is available only while storing the pair in the database!")
      document.getElementById("decryptxbox").checked = false;
    }
    else if (id_user.trim() == '') {
      alert("The blockstack ID is required for the decryption! Please, fill it in the 'Generate Keys' tab.")
      document.getElementById("decryptxbox").checked = false;
    }
    else if (!id_user.trim().endsWith("id.blockstack")) {
      alert("Invalid blockstack ID!");
      document.getElementById("decryptxbox").checked = false;
    }
    else if (id_user.trim() != blockstack_user) {
      alert("This blockstack ID could not be verified!");
      document.getElementById("decryptxbox").checked = false;
    }
    else if (pass.trim() == '') {
      alert("A passphrase is required for the decryption! Please, fill it in the 'Generate Keys' tab.")
      document.getElementById("decryptxbox").checked = false;
    }
    else if (pass.split(" ").join("").length < 7) {
      alert("The passphrase must have at least 7 characters!");
      document.getElementById("decryptxbox").checked = false;
    }
    else if (cryptedMsg.trim() == "" && decryptedMsg.readOnly == false) {
      alert("Can't decrypt an empty message!");
      document.getElementById("decryptxbox").checked = false;
    }
    else if (
      cryptedMsg.trim() != "" &&
      crypt.decrypt(cryptedMsg, pass) == false &&
      decryptedMsg.readOnly == false
    ) {
      if (my_prkey.trim() == "") {
        alert("Decryption failed! Your private key is not defined.");
        document.getElementById("decryptxbox").checked = false;
      } else if (
        !(my_prkey.trim().startsWith("-----BEGIN RSA PRIVATE KEY-----") &&
        my_prkey.trim().endsWith("-----END RSA PRIVATE KEY-----")) &&
        decryptedMsg.readOnly == false) {
        alert("Decryption failed! Your private key is invalid.");
        document.getElementById("decryptxbox").checked = false;
      }
    }
    else if (
      crypt.decrypt(cryptedMsg, pass) == null &&
      decryptedMsg.readOnly == false
    ) {
      $("#isnotvalid").text(
        "Pair could not be validated! Invalid encrypted message."
      );
      document.getElementById("decryptxbox").checked = false;
      console.log(
        "The following pair could not be validated and can not be added in the database: {Email:",
        email,
        ", Public key: ",
        pkey,
        "}"
      );
    }
    else if (
      crypt.decrypt(cryptedMsg, pass) != null &&
      decryptedMsg.readOnly == false
    ) {
      document.getElementById("decrypted").value = crypt.decrypt(
        cryptedMsg,
        pass
      );
      document.getElementById("decryptxbox").disabled = true;
      document.getElementById("decryptxbox").checked = true;
      document.getElementById("crypted").readOnly = true;
      document.getElementById("decrypted").readOnly = true;
      $("#isvalid").text(
        "Pair is validated and can be added to the DPK database!"
      );
      console.log(
        "The following pair is validated and can be added to the decentralized database: {Email:",
        email,
        ", Public key: ",
        pkey,
        "}"
      );
    }
    else {
      alert("Decryption failed!");
    }
  }

  // this function is for the Reset button that resets all the fields 
  clearAll() {
    document.getElementById("recepient_email").value = "";
    document.getElementById("topic").value = "";
    document.getElementById("message").value = "";
    document.getElementById("crypted").value = "";
    document.getElementById("decrypted").value = "";
    document.getElementById("encryptxbox").checked = false;
    document.getElementById("decryptxbox").checked = false;
    document.getElementById("encryptxbox").disabled = false;
    document.getElementById("decryptxbox").disabled = false;
    document.getElementById("crypted").readOnly = false;
    document.getElementById("decrypted").readOnly = true;
    $("#isvalid").text("");
    $("#isnotvalid").text("");
  }

  render() {
    const { person } = this.state;
    const { userSession } = this.props;

    return !userSession.isSignInPending() && person ? (
      <div id="Send an email (Validation Process)" className="tabcontent">
        <h2 className="send_mail">Send an encrypted email message</h2>
        <br />
        <label htmlFor="email">To:</label>
        <br />
        <input
          type="email"
          id="recepient_email"
          className="recepient-email"
          name="email"
          placeholder="Enter the other peer's email address..."
        />

        <br /> <br />
        <label htmlFor="email">Topic:</label> (Suggested: Your blockstack id)
        <br />
        <textarea
          type="topic"
          id="topic"
          name="Topic"
          placeholder="Enter your blockstack ID or another topic..."
          rows="3"
          cols="69"
        ></textarea>

        <br /> <br />
        <label htmlFor="email">Message:</label>
        <br />
        <textarea
          id="message"
          name="Message"
          placeholder="Enter your message here..."
          rows="10"
          cols="69"
        ></textarea>

        <br />
        <label htmlFor="encrypted">Encrypt</label>
        <input
          type="checkbox"
          id="encryptxbox"
          className="my_input"
          onClick={e => this.encryptedMsg(e)}
        ></input>

        <br />
        <br />
        <label htmlFor="cryptedmsg">Encrypted Message:</label>
        <br />
        <textarea
          id="crypted"
          name="cryptedmsg"
          placeholder="Encrypted message with the other peer's public key..."
          rows="10"
          cols="69"
          readOnly
        ></textarea>

        <br />
        <label htmlFor="decrypted_">Decrypt</label>
        <input
          type="checkbox"
          id="decryptxbox"
          className="my_input"
          onClick={e => this.decryptedMsg(e)}
        ></input>
        <br />

        <br />
        <label htmlFor="decrypted">Decrypted Message:</label>
        <br />
        <textarea
          id="decrypted"
          name="decrypted"
          placeholder="Decrypted message with your private key..."
          rows="10"
          cols="69"
          readOnly
        ></textarea>
        <br />
        <strong id="isvalid" className="isvalid"></strong>
        <strong id="isnotvalid" className="isnotvalid"></strong>

        <br />
        <button
          type="reset"
          id="reset"
          className="btn-res"
          value="Reset"
          onClick={e => this.clearAll(e)}
        >
          Reset
        </button>
        <br />
        <button
          className="btn btn-primary btn-lg"
          id="send"
          onClick={e => this.sendMail(e)}
        >
          Send
        </button>
      </div>
    ) : null;
  }
}
export default SecureEmailForm;
