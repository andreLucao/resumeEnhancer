document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form"),
        fileInput = document.querySelector(".file-input"),
        uploadedArea = document.querySelector(".uploaded-area"),
        submitButton = document.getElementById("submitFileButton"),
        swiperContainer = document.querySelector(".swiper-container"),
        loadingSection = document.getElementById("loaderSection"),
        explanationHeader = document.querySelector(".explanationHeader"),
        adContainer = document.getElementById("adContainer"),
        wrapperDiv = document.querySelector(".wrapper");

    fileInput.accept = ".pdf,.docx";
    fileInput.multiple = false;

    form.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", handleFileInputChange);

    submitButton.addEventListener("click", handleSubmitButtonClick);

    function handleFileInputChange(event) {
        const { target } = event;
        uploadedArea.innerHTML = '';

        const file = target.files[0];
        if (file) {
            const fileName = getTruncatedFileName(file.name);
            const fileExtension = getFileExtension(fileName);

            if (isValidFileExtension(fileExtension)) {
                displayFile(file, fileName);
                enableSubmitButton();
            } else {
                alert("Please select a PDF or DOCX file.");
                resetFileInput();
            }
        }
    }

    function handleSubmitButtonClick() {
        if (explanationHeader) {
            explanationHeader.textContent = "Select the resume format!";
        }
        removeFormElements();
        showSwiperContainer();
        initializeSwiper();
        handleImageSelection();
    }

    function getTruncatedFileName(fileName) {
        if (fileName.length >= 12) {
            const [name, extension] = fileName.split('.');
            return `${name.substring(0, 13)}... .${extension}`;
        }
        return fileName;
    }

    function getFileExtension(fileName) {
        return fileName.split('.').pop().toLowerCase();
    }

    function isValidFileExtension(fileExtension) {
        return ['pdf', 'docx'].includes(fileExtension);
    }

    function displayFile(file, fileName) {
        const fileSize = formatFileSize(file.size);
        const uploadedHTML = `
            <li class="row">
                <div class="content upload">
                    <i class="fas fa-file-alt"></i>
                    <div class="details">
                        <span class="name">${fileName} • Uploaded</span>
                        <span class="size">${fileSize}</span>
                    </div>
                </div>
                <div class="removeButtonContainer">
                    <button class="removeButton">&#10005;</button>
                </div>
            </li>`;
        uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);

        const removeButton = uploadedArea.querySelector(".removeButton");
        removeButton.addEventListener("click", handleRemoveButtonClick);
    }

    function formatFileSize(size) {
        size /= 1024;
        return (size < 1024) ? `${size.toFixed(2)} KB` : `${(size / 1024).toFixed(2)} MB`;
    }

    function handleRemoveButtonClick() {
        disableSubmitButton();
        this.closest('li').remove();
    }

    function enableSubmitButton() {
        submitButton.removeAttribute('disabled');
        submitButton.id = "submit-btn-enabled";
    }

    function disableSubmitButton() {
        submitButton.setAttribute('disabled', '');
        submitButton.id = "submitFileButton";
    }

    function resetFileInput() {
        fileInput.value = '';
    }

    function removeFormElements() {
        form.remove();
        submitButton.remove();
        uploadedArea.remove();
    }

    function showSwiperContainer() {
        swiperContainer.style.display = 'block';
    }

    function initializeSwiper() {
        new Swiper('.swiper-container', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            loop: true,
            slidesPerView: '2',
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }

    function handleImageSelection() {
        document.querySelectorAll('.resumeTemplate').forEach(image => {
            const parentSlide = image.closest('.swiper-slide');
            const hoverCircle = parentSlide.querySelector('.hover-circle');

            image.addEventListener('click', () => handleImageClick(image));
            hoverCircle.addEventListener('click', () => handleImageClick(image));
        });
    }

    function handleImageClick(image) {
        selectedImageURL = image.src;
        hideSwiperAndExplanation();
        showLoadingAndAdSections();
    }

    function hideSwiperAndExplanation() {
        swiperContainer.remove();
        explanationHeader.remove();
    }

    function showLoadingAndAdSections() {
        loadingSection.style.display = 'flex';

        setTimeout(() => {
            loadingSection.style.display = 'none';
            adContainer.style.display = 'block';

            setTimeout(() => {
                adContainer.style.display = 'none';
                displayEmailForms();
            }, 6000); 
        }, 6000); 
    }

    function displayEmailForms() {
        const newH1 = document.createElement("h1");
        newH1.textContent = "Upload Completed!";
        newH1.style.color = '#6990F2';
        wrapperDiv.appendChild(newH1);

        const newForm = document.createElement("form");
        newForm.innerHTML = `
            <label for="userInput" id="userInputLabel">Enter your email :</label>
            <input type="text" id="userInput" name="userInput">
            <div id="submitBtnContainer">
                <button type="submit" class="submitEmailButton">Submit</button>
            </div>`;
        wrapperDiv.appendChild(newForm);

        newForm.addEventListener("submit", handleEmailFormSubmit);
    }

    function handleEmailFormSubmit(event) {
        event.preventDefault();
        const emailInput = document.getElementById("userInput").value;

        if (isValidEmail(emailInput)) {
            saveEmail(emailInput);
            alert("Email saved successfully!");
        } else {
            alert("Please enter a valid email address.");
        }
    }

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function saveEmail(email) {
        // You can add logic to save the email, such as sending it to a server or storing it locally
        console.log("Email saved:", email);
    }
});
