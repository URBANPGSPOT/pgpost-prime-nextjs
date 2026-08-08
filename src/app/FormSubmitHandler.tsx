"use client";

import { useEffect } from "react";

export default function FormSubmitHandler() {
  useEffect(() => {
    // 1. Convert non-functional Radix/Shadcn comboboxes to native select dropdowns
    const patchDropdowns = () => {
      const forms = document.querySelectorAll("form");
      forms.forEach((form) => {
        const hiddenSelects = form.querySelectorAll("select[aria-hidden='true']");
        hiddenSelects.forEach((selectEl) => {
          const select = selectEl as HTMLSelectElement;
          
          // Make select visible and styled premium
          select.removeAttribute("aria-hidden");
          select.removeAttribute("tabindex");
          select.style.position = "static";
          select.style.width = "100%";
          select.style.height = "2.5rem";
          select.style.opacity = "1";
          select.style.clip = "auto";
          select.style.overflow = "visible";
          select.className = "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer text-slate-800 dark:text-slate-100";

          // Set name attribute so standard form submission works
          if (!select.getAttribute("name")) {
            select.setAttribute("name", "property");
          }

          // If first option is empty, set placeholder text
          if (select.options[0] && select.options[0].value === "") {
            select.options[0].text = "Select a property";
          }

          // Find and hide the non-functional Radix button
          const parent = select.parentElement;
          if (parent) {
            const comboboxBtn = parent.querySelector("button[role='combobox']");
            if (comboboxBtn) {
              (comboboxBtn as HTMLElement).style.display = "none";
            }
          }
        });
      });
    };

    // Run immediately and also on a short delay to account for parsing/hydration
    patchDropdowns();
    const timeoutId = setTimeout(patchDropdowns, 100);

    // 2. Handle Form Submissions
    const handleFormSubmit = async (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;

      // Skip standard forms that define their own action
      if (form.getAttribute("action")) {
        return;
      }

      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      const originalButtonText = submitButton ? submitButton.innerHTML : "Send Enquiry";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Sending...
        `;
      }

      const nameInput = form.querySelector("#name") as HTMLInputElement | null;
      const phoneInput = form.querySelector("#phone") as HTMLInputElement | null;
      const emailInput = form.querySelector("#email") as HTMLInputElement | null;
      const messageInput = form.querySelector("#message") as HTMLTextAreaElement | null;
      const selectElement = form.querySelector("select") as HTMLSelectElement | null;

      const data = {
        name: nameInput?.value || "",
        phone: phoneInput?.value || "",
        email: emailInput?.value || "",
        message: messageInput?.value || "",
        property: selectElement?.value || "both"
      };

      // Validation
      if (!data.name || !data.phone) {
        alert("Please fill in your name and phone number.");
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
        return;
      }

      try {
        // Submit to live WordPress API endpoint
        const wpBase = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://wp.pgspot.co.in";
        const response = await fetch(`${wpBase.replace(/\/+$/, "")}/wp-json/pgspot/v1/lead`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert("Success! Your enquiry has been received. Our team will contact you shortly.");
          form.reset();
        } else {
          alert("Error: " + (result.message || "Failed to submit enquiry. Please try again."));
        }
      } catch (err) {
        console.error("Form submission error:", err);
        alert("Could not connect to the server. Please try again or contact us directly.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    };

    document.addEventListener("submit", handleFormSubmit);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, []);

  return null;
}
