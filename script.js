document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SHOPPING CART & CHECKOUT LOGIC
       ========================================================================== */
    let cart = [];

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartTrigger = document.getElementById('cart-trigger');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.querySelector('.cart-footer .btn-primary');

    // Open Cart
    if (cartTrigger) {
        cartTrigger.addEventListener('click', () => {
            if(cartSidebar) cartSidebar.classList.add('open'); 
            if(cartOverlay) cartOverlay.classList.add('show');
        });
    }

    // Close Cart
    function closeCart() {
        if(cartSidebar) cartSidebar.classList.remove('open');
        if(cartOverlay) cartOverlay.classList.remove('show');
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Add to Cart Functionality
    const addButtons = document.querySelectorAll('.btn-add-cart');
    
    addButtons.forEach(btn => {
        btn.removeAttribute('onclick'); 

        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const card = this.closest('.menu-card');
            const name = card.querySelector('h3').textContent.trim();
            const priceString = card.querySelector('.menu-price').textContent.replace('$', '').trim();
            const price = parseFloat(priceString); 
            const imgSrc = card.querySelector('img').src;

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: name, price: price, image: imgSrc, quantity: 1 });
            }

            updateCartUI();

            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> Added';
            this.style.backgroundColor = '#4CAF50'; 
            this.style.color = '#fff';
            this.style.borderColor = '#4CAF50';

            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
            }, 1200);
        });
    });

    // Update Cart UI
    function updateCartUI() {
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += (item.price * item.quantity);
        });

        cartCountElements.forEach(el => el.textContent = totalItems);
        if (cartTotalAmount) cartTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;

        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Your bag is empty.</p>';
            return;
        }

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.marginBottom = '15px';
            itemDiv.style.gap = '12px';
            itemDiv.style.paddingBottom = '15px';
            itemDiv.style.borderBottom = '1px solid #eee';

            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 14px; margin-bottom: 2px; color: #1B1B1B;">${item.name}</h4>
                    <div style="font-size: 13px; color: #555;">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="remove-btn" data-index="${index}" style="background: none; border: none; color: #d9534f; cursor: pointer; padding: 5px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const indexToRemove = this.getAttribute('data-index');
                cart.splice(indexToRemove, 1);
                updateCartUI();
            });
        });
    }

    // Checkout Logic
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add some items before checking out.");
                return;
            }
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            checkoutBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                checkoutBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Order Confirmed!';
                checkoutBtn.style.backgroundColor = '#4CAF50';
                checkoutBtn.style.color = '#fff';
                cart = [];
                updateCartUI(); 

                setTimeout(() => {
                    checkoutBtn.innerHTML = originalText;
                    checkoutBtn.style.backgroundColor = '';
                    checkoutBtn.style.color = '';
                    checkoutBtn.style.pointerEvents = 'all';
                    closeCart(); 
                }, 2000);
            }, 1500); 
        });
    }

    /* ==========================================================================
       2. UI INTERACTIONS & ANIMATIONS
       ========================================================================== */

    const header = document.getElementById('navbar');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    const faqCards = document.querySelectorAll('.faq-interactive-card');
    faqCards.forEach(card => {
        const trigger = card.querySelector('.faq-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                faqCards.forEach(c => c.classList.remove('active'));
                if (!isActive) card.classList.add('active');
            });
        }
    });

    /* ==========================================================================
       3. FORMS & FOOTER
       ========================================================================== */

    const classicForm = document.getElementById('classicForm');
    if (classicForm) {
        classicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = classicForm.querySelector('.btn-submit-classic');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending...';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                btn.innerHTML = 'Message Sent Successfully!';
                btn.style.backgroundColor = '#4CAF50'; 
                btn.style.color = 'white';
                classicForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.pointerEvents = 'all';
                }, 3000);
            }, 1200);
        });
    }

    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you for your feedback! Your review has been submitted.");
            reviewForm.reset();
        });
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ==========================================================================
       4. DARK MODE TOGGLE LOGIC
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const savedTheme = localStorage.getItem('pinholeTheme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('pinholeTheme', 'dark');
                if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                localStorage.setItem('pinholeTheme', 'light');
                if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

   /* ================= CHATBOT FIXED (WITH MEMORY) ================= */

const chatBtn = document.getElementById('ai-chat-btn');
const chatWindow = document.getElementById('ai-chat-window');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const sendBtn = document.getElementById('send-btn');
const closeChatBtn = document.getElementById('close-chat');
const clearChatBtn = document.getElementById('clear-chat-btn');

// 1. ADD THIS: An array to remember the conversation
let chatHistory = []; 

/* OPEN CHAT */
if (chatBtn) chatBtn.addEventListener('click', () => {
    chatWindow.classList.remove('hidden');
});

/* CLOSE CHAT */
if (closeChatBtn) closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

/* ADD MESSAGE */
function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = sender === 'user' ? 'user-msg' : 'ai-msg';
    
    // Using innerHTML so Markdown (like bold text) renders nicely, 
    // but if you prefer plain text, you can change this back to innerText
    msg.innerHTML = text; 
    
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* SEND MESSAGE */
async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    try {
        const res = await fetch("https://pinhole-coffee.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // 2. ADD THIS: We are now sending the history along with the new message
            body: JSON.stringify({ 
                message: text,
                history: chatHistory 
            })
        });

        if (!res.ok) {
            addMessage("Server error ⚠️", "ai");
            return;
        }

        const data = await res.json();
        const aiMessage = data.choices?.[0]?.message?.content || "Sorry, my brain is brewing! Try again in a moment.";
        
        addMessage(aiMessage, "ai");

        // 3. ADD THIS: Save both messages to the history array for the next time
        chatHistory.push({ role: "user", content: text });
        chatHistory.push({ role: "assistant", content: aiMessage });

    } catch (err) {
        console.error(err);
        addMessage("Backend not working 🚨", "ai");
    }
}

/* BUTTON CLICK */
if (sendBtn) sendBtn.addEventListener('click', handleSend);

/* ENTER KEY */
if (chatInput) chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

/* CLEAR CHAT */
if (clearChatBtn) clearChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    chatHistory = []; // Clear the memory too!
});

/* ================= MICROPHONE (SPEECH TO TEXT) ================= */
const micBtn = document.getElementById('mic-btn');

// Check if the browser supports speech recognition (Chrome, Safari, Edge)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stops listening when you stop talking
    recognition.interimResults = false;
    
    // When the user clicks the mic button
    if (micBtn) {
        micBtn.addEventListener('click', () => {
            micBtn.style.color = 'red'; // Turn the mic icon red so the user knows it's listening
            recognition.start();
        });
    }

    // When the browser successfully translates the voice to text
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        // Put the spoken words into the chat input box
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.value = transcript;
        }
        
        micBtn.style.color = ''; // Change the mic color back to normal
        
        // THIS IS THE FIX: Automatically send the message to the bot
        handleSend(); 
    };

    // If there is an error (like user denying microphone permissions)
    recognition.onerror = (event) => {
        console.error("Microphone error: ", event.error);
        micBtn.style.color = '';
    };

    // When it finishes listening
    recognition.onend = () => {
        micBtn.style.color = '';
    };

} else {
    // If the user's browser is very old and doesn't support voice typing
    if (micBtn) micBtn.style.display = 'none';
    console.log("Speech Recognition not supported in this browser.");
}

    // Updated Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const cards = document.querySelectorAll('.bubble-inner');

cards.forEach(card => {
    card.onclick = function() {
        lightbox.classList.add('active'); // Use class instead of style
        lightboxImg.src = this.querySelector('img').src;
        document.body.classList.add('modal-open'); // Stops background animations
        document.body.style.overflow = 'hidden'; 
    }
});

const closeLightboxBtn = document.querySelector('.close-lightbox');

if (closeLightboxBtn) {
    closeLightboxBtn.onclick = () => {
        lightbox.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
    };
}

}); // End of File