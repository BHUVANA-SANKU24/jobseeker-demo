// script.js (UPDATED) — uses Flask POST /extract and matches your backend JSON keys
const API_BASE_URL = "http://127.0.0.1:5000";

async function uploadResume() {
  const fileInput = document.getElementById("resumeFile");
  const file = fileInput?.files?.[0];

  if (!file) {
    alert("Please upload a resume");
    return;
  }

  document.getElementById("loading")?.classList.remove("hidden");

  try {
    // Read uploaded file as text (works for your .txt samples; also works for text-based PDFs if extracted elsewhere)
    const resumeText = await file.text();

    const res = await fetch(`${API_BASE_URL}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: resumeText })
    });

    if (!res.ok) throw new Error(`Extract failed: ${res.status}`);

    const data = await res.json();
    localStorage.setItem("profileData", JSON.stringify(data));
    window.location.href = "register.html";
  } catch (err) {
    alert("Error processing resume");
    console.error(err);
  } finally {
    document.getElementById("loading")?.classList.add("hidden");
  }
}

window.onload = function () {
  const storedData = localStorage.getItem("profileData");
  if (!storedData) return;

  const data = JSON.parse(storedData);

  // ✅ Match your backend keys (resume_nlp.py output)
  autoFill("name", data.personal?.full_name);
  autoFill("email", data.personal?.email);
  autoFill("phone", data.personal?.phone);

  autoFill("degree", data.education?.highest_qualification);
  autoFill("branch", data.education?.branch_or_major);

  // You currently don't extract year explicitly; keep blank if field exists
  // autoFill("year", "");

  autoFill("skills", (data.skills || []).join(", "));
  autoFill("employment", data.employment?.status);

  // Optional: show warnings somewhere if you have a <div id="warnings"></div>
  const warningsBox = document.getElementById("warnings");
  if (warningsBox && Array.isArray(data.warnings) && data.warnings.length > 0) {
    warningsBox.innerHTML = data.warnings.map(w => `<li>${w}</li>`).join("");
  }
};

function autoFill(id, value) {
  if (!value) return;

  const element = document.getElementById(id);
  if (!element) return;

  element.value = value;
  element.classList.add("autofilled");
}

// ✅ Demo-safe submit: no /profile endpoint required.
// If you want to actually store, add /profile in Flask later.
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
    personal: { full_name: name, email, phone },
    education: {
      highest_qualification: degree,
      branch_or_major: branch,
      year
    },
    skills: skillsText.split(",").map(s => s.trim()).filter(Boolean),
    employment: { status: employment }
  };

  // Store locally for demo + show confirmation
  localStorage.setItem("finalProfile", JSON.stringify(payload, null, 2));
  alert("✅ Profile ready (Demo). You can copy-paste into the official DEET portal.");
}
