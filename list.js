let localInput = JSON.parse(localStorage.getItem("Location"));
let leftCol = document.querySelector(".left-col");
let rightCol = document.querySelector(".right-col");
let bookBtn;
console.log(localInput);

let map = document.querySelector(".gmap_canvas");
let house_redirect = document.getElementById("house");

async function getDetails(localInput) {
  const url = `https://airbnb13.p.rapidapi.com/search-location?location=${localInput}&checkin=2023-09-16&checkout=2023-09-17&adults=1&children=0&infants=0&pets=0&page=1&currency=USD`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ab8891670dmsh1310e4d11b78b18p1a8b5fjsn43f44804017c",
      "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    let datas = result.results;
    // console.log(result);

    // localStorage.setItem("datas", JSON.stringify(result.results));
    createCards(datas);

    // console.log(datas);
  } catch (error) {
    console.error(error);
  }
}
getDetails(localInput);
// let datas = JSON.parse(localStorage.getItem("datas"));
// console.log(datas);
function searcBarDataGen(localInput) {
  let userLocation = document.querySelector(".user-location");
  userLocation.textContent = localInput[0];
  let checkindates = localInput[1].split("-")[1];
  let months = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  let checkMonth = months[checkindates];
  let startDate = localInput[1].split("-")[2];
  let endDate = localInput[2].split("-")[2];
  let guestNum = localInput[3];
  let Dates = document.querySelector(".dates");
  Dates.innerText = `${checkMonth} ${startDate}-${endDate}`;
  let GuestCount = document.querySelector(".guest-count");
  GuestCount.innerText = `${guestNum} Guest`;

  console.log(checkMonth, startDate, endDate, guestNum);
}
searcBarDataGen(localInput);

let ptag = document.createElement("p");
ptag.innerText = `200+ stays in ${localInput[0]}`;
ptag.classList.add("ptag");
leftCol.append(ptag);

//function for limiting datas to 9
function createCards(listDatas) {
  for (let i = 0; i < 9; i++) {
    createListingCard(listDatas[i], i);
    console.log(listDatas[i]);
  }
}
// createCards(datas);
//function for displaying the card

function createListingCard(listing, i) {
  let listingCard = document.createElement("div");
  listingCard.classList.add("listing-card");

  listingCard.innerHTML = `

  <div class="house-img">
  <a href="${listing.url}" target="_blank">

 <img src=${listing.images[0]}></a>
    </div>
    <div class="house-info">
        <p>${listing.type}</p>
        <h3>${listing.name}</h3>
        <p>Bedrooms:${listing.bedrooms} / Bathrooms:${
    listing.bathrooms
  } / Beds:${listing.beds}</p>
  <div class="review-count">
  <img src="images/star.png" alt="" />
  <h3>${listing.rating ? listing.rating : 4}</h3>
  <p>(${listing.reviewsCount} reviews)</p>
</div>

    <div class="house-price">
            <p class="guest">Guest:${listing.persons}</p>
            <p class="Amenities">${listing.previewAmenities.join(" \u00B7 ")}

            <h4>$ ${listing.price.priceItems[0].amount} <span>/ ${
    listing.price.priceItems[0].title
  }</span></h4>
        </div>
    </div>
        `;
  let basePrice = Number(listing.price.priceItems[0].amount);
  let AdditonalFee = Number(basePrice * 0.1);
  let TotalPrice = Number(basePrice + AdditonalFee);

  bookBtn = document.createElement("div");
  bookBtn.classList = "book-btn";
  const costButton = document.createElement("button");
  costButton.innerText = "Show Booking Cost Breakdown";
  costButton.classList.add("cost-button");
  bookBtn.appendChild(costButton);
  costButton.addEventListener("click", () => {
    displayModal(basePrice, AdditonalFee, TotalPrice);
  });

  listingCard.append(bookBtn);

  //   bookBtn.innerHTML = `

  //   <button
  //   type="button"
  //   class="btn btn-primary"
  //   data-bs-toggle="modal"
  //   data-bs-target="#exampleModal"
  // >
  // Booking Cost Breakdown
  // </button>

  // <div
  //   class="modal fade"
  //   id="exampleModal"
  //   tabindex="-1"
  //   aria-labelledby="exampleModalLabel"
  //   aria-hidden="true"
  // >
  //   <div class="modal-dialog">
  //     <div class="modal-content">
  //       <div class="modal-header">
  //         <h1 class="modal-title fs-5" id="exampleModalLabel">
  //           Booking Cost
  //         </h1>
  //         <button
  //           type="button"
  //           class="btn-close"
  //           data-bs-dismiss="modal"
  //           aria-label="Close"
  //         ></button>
  //       </div>
  //       <div class="modal-body">
  //         <p>Base Rate: $${basePrice}</p>
  //         <p>Additonal Fees: $${AdditonalFee}</p>
  //         <p>Total Cost: $${TotalPrice}</p>
  //       </div>
  //       <div class="modal-footer">
  //         <button
  //           type="button"
  //           class="btn btn-secondary"
  //           data-bs-dismiss="modal"
  //         >
  //           Close
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // </div>

  // listingCard.appendChild(bookBtn);

  if (listing.isSuperhost) {
    const superhostIndicator = document.createElement("p");
    superhostIndicator.innerText = "Superhost";

    superhostIndicator.classList.add("super-host");
    listingCard.appendChild(superhostIndicator);
  }
  if (listing.rareFind) {
    const rareFindIndicator = document.createElement("p");
    rareFindIndicator.innerText = "Rare Find";
    rareFindIndicator.classList.add("rare-find");

    listingCard.appendChild(rareFindIndicator);
  }

  leftCol.append(listingCard);

  rightCol.innerHTML = `
  <iframe
  src="https://maps.google.com/maps?q=${listing.lat},${listing.lng}&hl=en&z=14&amp;output=embed"
  width="45%"
  height="400"
  frameborder="0"
  style="border: 0"
  allowfullscreen
></iframe>`;
  function idSave() {
    if (localStorage.getItem("id") !== null) {
      localStorage.removeItem("id");
    } else {
      localStorage.setItem("id", JSON.stringify(i));
    }
  }
}

//function for adding costBreakdown

function displayModal(basePrice, AdditonalFee, TotalPrice) {
  const modal = document.createElement("div");
  modal.style.display = "block";
  modal.style.width = "400px";
  modal.style.height = "270px";
  modal.classList.add("modal");

  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.padding = "20px";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  modal.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Rate: $${basePrice}</p>
        <p>Additional Fees: $${AdditonalFee.toFixed(2)}</p>
        <p>Total Cost: $${TotalPrice.toFixed(2)}</p>
    `;
  document.body.append(modal);

  console.log(basePrice, AdditonalFee, TotalPrice);

  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.addEventListener("click", () => (modal.style.display = "none"));
  modal.appendChild(closeButton);
}
