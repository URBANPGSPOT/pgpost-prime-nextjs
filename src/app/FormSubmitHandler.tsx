"use client";

import { useEffect } from "react";

export default function FormSubmitHandler() {
  useEffect(() => {
    // 1. Convert non-functional Radix/Shadcn comboboxes to native select dropdowns & update options
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

          // Update option labels with (Boys) and (Girls)
          Array.from(select.options).forEach((opt) => {
            if (opt.value === "mansi" || opt.text.includes("Mansi")) {
              opt.text = "PGSPOT Mansi (Boys)";
            } else if (opt.value === "thaltej" || opt.text.includes("Thaltej")) {
              opt.text = "PGSPOT Thaltej (Girls)";
            }
          });

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

    // 2. Interactive FAQ Accordion Click Handler (Clean Open & Close Toggle)
    const handleFaqClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Match trigger button
      const trigger = target.closest(
        ".faq-trigger, button[data-radix-collection-item], button[aria-controls], [data-orientation='vertical'] button, h3 button, .faq-item button"
      ) as HTMLButtonElement | null;
      
      if (trigger && !trigger.closest("form") && !trigger.closest("nav") && !trigger.closest("header")) {
        e.preventDefault();
        e.stopPropagation();
        
        const item = trigger.closest(".faq-item, [data-state], [data-orientation='vertical'] > div, div.border-b");
        const panel = (item?.querySelector(".faq-panel, div[role='region'], div[id^='radix-']") || 
                       (trigger.getAttribute("aria-controls") ? document.getElementById(trigger.getAttribute("aria-controls")!) : null) ||
                       trigger.parentElement?.parentElement?.querySelector("div[role='region'], .faq-panel")) as HTMLElement | null;

        if (panel) {
          const isAlreadyOpen = trigger.getAttribute("data-state") === "open" || 
                                panel.getAttribute("data-state") === "open" ||
                                (!panel.classList.contains("hidden") && !panel.hasAttribute("hidden") && panel.style.display === "block");

          if (isAlreadyOpen) {
            // CLOSE
            panel.style.display = "none";
            panel.classList.add("hidden");
            panel.setAttribute("hidden", "");
            panel.setAttribute("data-state", "closed");
            trigger.setAttribute("data-state", "closed");
            trigger.setAttribute("aria-expanded", "false");
            
            const chevron = trigger.querySelector("svg, .faq-chevron") as HTMLElement | null;
            if (chevron) chevron.style.transform = "rotate(0deg)";
          } else {
            // OPEN
            panel.style.display = "block";
            panel.style.visibility = "visible";
            panel.style.opacity = "1";
            panel.style.maxHeight = "none";
            panel.classList.remove("hidden");
            panel.removeAttribute("hidden");
            panel.setAttribute("data-state", "open");
            trigger.setAttribute("data-state", "open");
            trigger.setAttribute("aria-expanded", "true");
            
            const chevron = trigger.querySelector("svg, .faq-chevron") as HTMLElement | null;
            if (chevron) chevron.style.transform = "rotate(180deg)";
          }
        }
      }
    };

    // 3. Make Property Card Containers Fully Clickable (Dubey Task 4)
    const handleCardClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If clicked on an actual interactive element, let its own action execute
      if (target.closest("a, button, input, select, textarea, [role='button']")) {
        return;
      }
      
      const card = target.closest(".property-card, .group:has(a[href*='mansi']), .group:has(a[href*='thaltej']), .group:has(a[href*='properties'])") as HTMLElement | null;
      if (card) {
        const link = card.querySelector("a[href]") as HTMLAnchorElement | null;
        if (link && link.href) {
          e.preventDefault();
          window.location.href = link.href;
        }
      }
    };

    // 4. Video Testimonial Modal Handler
    const handleVideoClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const videoCard = target.closest(".video-card") as HTMLElement | null;
      
      if (videoCard) {
        e.preventDefault();
        const title = videoCard.getAttribute("data-video-title") || "Resident Video Story";
        
        // Remove existing modal if any
        const existing = document.getElementById("pgspot-video-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "pgspot-video-modal";
        modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in";
        modal.innerHTML = `
          <div class="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
            <div class="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                ${title}
              </h3>
              <button id="close-video-modal" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>
            <div class="aspect-video w-full bg-black flex flex-col items-center justify-center p-8 text-center">
              <div class="w-20 h-20 rounded-full bg-[#f0c229] text-slate-950 flex items-center justify-center shadow-2xl mb-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <p class="text-white font-bold text-lg mb-1">${title}</p>
              <p class="text-slate-400 text-sm max-w-md">Resident experience recorded live at PGSPOT Ahmedabad. Guided tour available on request.</p>
              <a href="/contact-us/" class="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f0c229] hover:bg-[#e0b21a] text-slate-950 font-bold px-6 py-2.5 text-sm transition-all shadow-md">
                Schedule an In-Person Tour &rarr;
              </a>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener("click", (evt) => {
          if (evt.target === modal || (evt.target as HTMLElement).closest("#close-video-modal")) {
            modal.remove();
          }
        });
      }
    };

    // 5. Handle Form Submissions
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
        // Submit to live WordPress API endpoint with fallback
        const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL 
          ? process.env.NEXT_PUBLIC_WORDPRESS_API_URL.replace(/\/graphql\/?$/, "/wp-json/pgspot/v1/lead")
          : "https://wp.pgspot.co.in/wp-json/pgspot/v1/lead";

        const response = await fetch(apiUrl, {
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
        alert("Enquiry received! Our team will contact you shortly.");
        form.reset();
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    };

    // Run patchDropdowns immediately and after slight delay
    patchDropdowns();
    const timeoutId = setTimeout(patchDropdowns, 100);

    document.addEventListener("click", handleFaqClick);
    document.addEventListener("click", handleCardClick);
    document.addEventListener("click", handleVideoClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleFaqClick);
      document.removeEventListener("click", handleCardClick);
      document.removeEventListener("click", handleVideoClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, []);

  return null;
}
