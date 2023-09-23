document.addEventListener("DOMContentLoaded", async function () {
  const form = document.querySelector("#feedback");
  const companyNameInput = document.querySelector("#companyName");
  const prosInput = document.querySelector("#pros");
  const consInput = document.querySelector("#cons");
  const ratingValueInput = document.querySelector("#ratingValue");
  const starRating = document.querySelector("#star-rating");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const companyName = companyNameInput.value;
    const pros = prosInput.value;
    const cons = consInput.value;
    const rating = ratingValueInput.value;

    try {
      const response = await axios.post(
        "http://localhost:3000/review/createFeedback",
        {
          companyName,
          pros,
          cons,
          rating,
        }
      );

      console.log("Submitted", response.status);
      form.reset();

      const stars = starRating.querySelectorAll("span");
      stars.forEach((star) => star.classList.remove("text-yellow-700"));

      if (response.status === 201) {
        console.log("Feedback submitted successfully!");
      } else if (response.status === 500) {
        alert(
          "An error occurred while submitting your feedback. Please try again later."
        );
      }
    } catch (error) {
      console.error(error);
    }
  });

  starRating.addEventListener("click", function (event) {
    const selectedValue = event.target.getAttribute("data-value");
    ratingValueInput.value = selectedValue;

    const stars = starRating.querySelectorAll("span");
    stars.forEach((star, index) => {
      if (index < selectedValue) {
        star.classList.add("text-yellow-700");
      } else {
        star.classList.remove("text-yellow-700");
      }
    });
  });

  document
    .getElementById("searchButton")
    .addEventListener("click", async function () {
      const companyName = document.getElementById("companySearch").value;

      try {
        const response = await axios.get(
          `http://localhost:3000/review/getAllFeedback?companyName=${companyName}`
        );

        const searchedCompanySection =
          document.getElementById("searchedCompany");
        searchedCompanySection.classList.remove("hidden");
        searchedCompanySection.innerHTML = "";

        if (response.data.length === 0) {
          const noResultsMessage = document.createElement("h1");
          noResultsMessage.textContent = `No feedback found for company : ${companyName}.`;
          searchedCompanySection.appendChild(noResultsMessage);
        } else {
          const searchedCompanyTitle = document.createElement("h1");
          searchedCompanyTitle.textContent = `Feedback for company : ${companyName}`;
          searchedCompanySection.appendChild(searchedCompanyTitle);

          const ratings = response.data
            .filter((review) => review.companyName === companyName)
            .map((review) => review.rating);

          if (ratings.length === 0) {
            const noRatingsMessage = document.createElement("p");
            noRatingsMessage.textContent =
              "No ratings available for this company.";
            searchedCompanySection.appendChild(noRatingsMessage);
          } else {
            const sumRatings = ratings.reduce(
              (total, rating) => total + rating,
              0
            );
            const overallRating = sumRatings / ratings.length;

            const overallRatingElement = document.createElement("p");
            overallRatingElement.textContent = `Overall Rating: ${overallRating.toFixed(
              2
            )}/5.00`;
            searchedCompanySection.appendChild(overallRatingElement);

            const searchedCompanyReviewsSection = document.createElement("div");
            searchedCompanySection.appendChild(searchedCompanyReviewsSection);

            const filteredReviews = response.data.filter((review) => {
              return review.companyName === companyName;
            });

            filteredReviews.forEach((review) => {
              const reviewCard = document.createElement("div");
              reviewCard.classList.add("border", "border-black");
              reviewCard.classList.add("m-4");
              reviewCard.classList.add("rounded-md");
              reviewCard.classList.add("pl-4");
              reviewCard.style.boxShadow = "0 0.4rem 0.8rem black";

              const reviewCardHeader = document.createElement("div");
              reviewCardHeader.classList.add("card-header");

              const reviewRating = document.createElement("span");
              reviewRating.classList.add("card-subtitle");
              reviewRating.textContent = `Rating: ${review.rating}/5`;
              reviewCardHeader.appendChild(reviewRating);

              reviewCard.appendChild(reviewCardHeader);

              const reviewCardBody = document.createElement("div");
              reviewCardBody.classList.add("card-body");

              const reviewPros = document.createElement("p");
              reviewPros.classList.add("card-text");
              reviewPros.textContent = `Pros: ${review.pros}`;
              reviewCardBody.appendChild(reviewPros);

              const reviewCons = document.createElement("p");
              reviewCons.classList.add("card-text");
              reviewCons.textContent = `Cons: ${review.cons}`;
              reviewCardBody.appendChild(reviewCons);

              reviewCard.appendChild(reviewCardBody);

              searchedCompanyReviewsSection.appendChild(reviewCard);
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
});
