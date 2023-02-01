console.log("JS Loaded");

const state = {
  contacts: [],
};

function getData(anzahl) {
  const getUser = fetch(
    "https://dummy-apis.netlify.app/api/contact-suggestions?count=" + anzahl
  );
  getUser
    .then(function (response) {
      if (!response.ok) {
        console.error("failed to Load Data");
      }
      return response.json();
    })
    .then((jsonData) => {
      state.contacts = jsonData;
      render();
    });
}

let countPendings = 0;
function pendings() {
  const pSection = document.querySelector(".pending");
  const pendingText = "pending invitations";
  let pendings = countPendings;
  let pendingAnzeige;

  if (pendings <= 0) {
    pendings = "No";
    countPendings = 0;
  }
  pendingAnzeige = pendings + " " + pendingText;
  pSection.innerHTML = pendingAnzeige;
}
pendings();

function contactTemplate(contactData) {
  /** wrapper der alle elemente umgibt */
  const wrapperElement = document.createElement("div");
  wrapperElement.classList.add("card");

  // Hintergrundbild
  const imageBGwrapper = document.createElement("div");
  imageBGwrapper.classList.add("image-wrapper");
  const backgroundImageUrl =
    "url(" +
    contactData.backgroundImage +
    "?random=" +
    contactData.name.first +
    ")";

  imageBGwrapper.style.backgroundImage = backgroundImageUrl;

  /** Close Button */
  const closeButton = document.createElement("button");
  closeButton.classList.add("close");
  closeButton.innerText = "X";
  closeButton.addEventListener("click", function () {
    wrapperElement.style.display = "none";
    countPendings -= 1;
    getData(1);
    pendings();
  });

  /** contact Image */
  const userImageDiv = document.createElement("div");
  userImageDiv.classList.add("user-image-div");
  const userImage = document.createElement("img");
  userImage.src = contactData.picture;
  userImageDiv.appendChild(userImage);

  /** contact name */
  const personName = document.createElement("h2");
  const personNameTxt = document.createTextNode(
    contactData.name.first + " " + contactData.name.last
  );
  personName.appendChild(personNameTxt);

  /** profession */
  const pProfession = document.createElement("p");
  const professionTxt = document.createTextNode(contactData.title);
  pProfession.appendChild(professionTxt);
  pProfession.classList.add("profession");

  /** Additional Information */
  const pMore = document.createElement("p");

  const pMoreTxt = document.createTextNode(
    contactData.mutualConnections + " Mutual Connections"
  );

  pMore.appendChild(pMoreTxt);
  pMore.classList.add("additional-information");

  /** Connect Button */
  const connectButton = document.createElement("button");
  connectButton.innerText = "Connect";
  connectButton.classList.add("connect");
  connectButton.addEventListener("click", function () {
    countPendings += 1;
    connectButton.innerText = "Pending";
    pendings();
  });

  wrapperElement.append(
    imageBGwrapper,
    closeButton,
    userImageDiv,
    personName,
    pProfession,
    pMore,
    connectButton
  );

  return wrapperElement;
}

function render() {
  for (let contact of state.contacts) {
    const personElement = contactTemplate(contact);
    console.log(personElement);
    document.querySelector(".suggestions").append(personElement);
  }
}

getData(8);
