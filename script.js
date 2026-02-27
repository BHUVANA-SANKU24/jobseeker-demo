const API_BASE_URL = "http://127.0.0.1:5000";

function uploadResume() {
    const fileInput = document.getElementById("resumeFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a resume");
        return;
    }

    document.getElementById("loading").classList.remove("hidden");

    const formData = new FormData();
    formData.append("resume", file);

    fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("profileData", JSON.stringify(data));
        window.location.href = "register.html";
    })
    .catch(error => {
        alert("Error processing resume");
        console.error(error);
    });
}

window.onload = function() {
    const storedData = localStorage.getItem("profileData");

    if (storedData) {
        const data = JSON.parse(storedData);

        autoFill("name", data.personal?.name);
        autoFill("email", data.personal?.email);
        autoFill("phone", data.personal?.phone);
        autoFill("degree", data.education?.degree);
        autoFill("branch", data.education?.branch);
        autoFill("year", data.education?.year);
        autoFill("skills", data.skills?.join(", "));
        autoFill("employment", data.employment);
    }
};

function autoFill(id, value) {
    if (!value) return;

    const element = document.getElementById(id);
    if (!element) return;

    element.value = value;
    element.classList.add("autofilled");
}

function submitProfile() {
    const name = document.getElementById("name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const degree = document.getElementById("degree")?.value || "";
    const branch = document.getElementById("branch")?.value || "";
    const year = document.getElementById("year")?.value || "";
    const skillsText = document.getElementById("skills")?.value || "";
    const employment = document.getElementById("employment")?.value || "";

    const payload = {
        personal: { name, email, phone },
        education: { degree, branch, year },
        skills: skillsText
            .split(",")
            .map(s => s.trim())
            .filter(Boolean),
        employment
    };

    fetch(`${API_BASE_URL}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to submit profile");
            }
            return response.json().catch(() => ({}));
        })
        .then(() => {
            alert("DEET Ready Profile submitted to backend successfully!");
        })
        .catch(error => {
            alert("Error submitting profile. Please try again.");
            console.error(error);
        });
}