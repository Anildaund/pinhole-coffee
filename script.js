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

   document.addEventListener('DOMContentLoaded', () => {

    /* ================= ALL YOUR EXISTING CODE SAME ================= */
    /* (I DID NOT CHANGE YOUR CART, UI, FORMS, ETC) */

    /* ========================================================================== */
    /* 5. PINHOLE AI BARISTA (FIXED WITH BACKEND) */
    /* ========================================================================== */

    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendBtn = document.getElementById('send-btn');
    const closeChatBtn = document.getElementById('close-chat');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const micBtn = document.getElementById('mic-btn');

    if (chatBtn && chatWindow) {
        chatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatWindow.classList.remove('hidden');
            chatBtn.classList.add('active'); 
            if(chatInput) chatInput.focus();
        });
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            chatBtn.classList.remove('active'); 
        });
    }

     const SYSTEM_PROMPT = `You are the Lead Waiter and Professional Barista at Pinhole Coffee. 
    Tone: Professional, friendly, whimsical, and community-focused. You are proud of our local Bernal Heights roots.

    STRICT RULES:
    1. ONLY answer questions about Pinhole Coffee. 
    2. If asked about unrelated topics, politely say: "I'd love to chat about that over a coffee, but I'm here to help you with our menu and shop info!"
    3. If a customer wants to order, tell them to click the "Add to Cart" buttons on the page.

    COFFEE MENU & PRICES:
    - Signature Cortado ($4.50): Equal parts espresso and steamed milk for a perfectly balanced flavor.
    - Single-Origin Pour Over ($5.50): Hand-poured filter coffee highlighting bright, floral notes.
    - Velvety Flat White ($4.75): Micro-foam poured over a double ristretto shot for a silky finish.
    - 18-Hour Cold Brew ($5.25): Steeped slowly for a low-acid, naturally sweet, high-caffeine kick.
    - Espresso Tonic ($6.00): A refreshing fizz of premium tonic water with a double shot of espresso.
    - Bernal Vibe Combo ($8.50): A double espresso and a pastry of your choice.

    PASTRY & SWEETS MENU:
    - Matcha Mochi Donut ($3.75): Our famous chewy mochi donut glazed with premium Japanese matcha.
    - Honey Glazed Donut ($3.50): Traditional mochi-style donut with a light, floral honey coating.
    - Golden Croissant ($4.25): Flaky, buttery layers baked fresh every morning at 5 AM.
    - Almond Frangipane ($5.00): Twice-baked croissant filled with rich almond cream and topped with flakes.
    - Double Choco Muffin ($4.00): Rich cocoa batter packed with 70% dark chocolate chunks.
    - Blueberry Lemon Scone ($3.95): Crumbly, buttery scone bursting with fresh blueberries and lemon zest.

    SHOP DETAILS:
    - Identity: We are a Women-owned, Asian-owned, and LGBTQ+ owned neighborhood heartbeat.
    - Beans: Sourced exclusively from Linea Caffe.
    - Location: 231 Cortland Ave, San Francisco (Bernal Heights).
    - Building History: Erected in the 1880s; it was originally Max Breithaupt's butcher shop. We opened Sept 12, 2014.
    - Pinholita: Our battery-operated cafe on wheels, currently in Ojai, CA for pop-ups and events.
    - Parking: Recommend the residential streets like Andover or Moultrie, just one block away.
    - Peak Hours: Busy between 8 AM – 11 AM; suggest takeaway during this time.`;

    let chatHistory = [{ role: "system", content: SYSTEM_PROMPT }];

    function addBubbleRow(txt, sender, isTyping = false) {
        if(!chatMessages) return;
        const row = document.createElement('div');
        row.className = `wa-msg-row ${sender === 'ai' ? 'ai-row' : 'user-row'}`;
        const bubble = document.createElement('div');
        bubble.className = `wa-bubble ${sender === 'ai' ? 'ai-bubble' : 'user-bubble'}`;
        
        if (isTyping) {
            bubble.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
        } else {
            bubble.textContent = txt;
        }

        row.appendChild(bubble);
        chatMessages.appendChild(row);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return row;
    }

    async function handleSend() {
        if(!chatInput) return;
        const text = chatInput.value.trim();
        if(!text) return;
        
        addBubbleRow(text, 'user');
        chatInput.value = '';
        let typingRow = addBubbleRow("", 'ai', true);

        try {
            // ✅ CALL YOUR FASTAPI BACKEND
            const res = await fetch("https://pinhole-coffee.onrender.com/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text,
                    history: chatHistory
                })
            });

            if(typingRow) typingRow.remove();

            if(!res.ok) {
                addBubbleRow("Server error. Please try again later. ⚠️", "ai");
                return;
            }

            const data = await res.json();
            const reply = data.choices[0].message.content;

            chatHistory.push(
                { role: "user", content: text },
                { role: "assistant", content: reply }
            );

            addBubbleRow(reply, 'ai');

        } catch(e) {
            if(typingRow) typingRow.remove();
            console.error(e);
            addBubbleRow("Backend not running or connection issue 🚨", "ai");
        }
    }

    if(sendBtn) sendBtn.addEventListener('click', handleSend);

    if(chatInput) {
        chatInput.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter') handleSend(); 
        });
    }

    if (clearChatBtn && chatMessages) {
        clearChatBtn.addEventListener('click', () => {
            chatHistory = [{ role: "system", content: SYSTEM_PROMPT }];
            chatMessages.innerHTML = '';
            addBubbleRow("Hi! How can I help you today? ☕", "ai");
        });
    }

    /* ================= VOICE ================= */

    if (micBtn && chatInput) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();

            micBtn.addEventListener('click', () => {
                recognition.start();
            });

            recognition.onresult = (event) => {
                chatInput.value = event.results[0][0].transcript;
                handleSend();
            };
        }
    }

});

    async function handleSend() {
        if(!chatInput) return;
        const text = chatInput.value.trim();
        if(!text) return;
        
        addBubbleRow(text, 'user');
        chatInput.value = '';
        let typingRow = addBubbleRow("", 'ai', true);

        try {
            // FIX: Using corsproxy to bypass strict browser blocks
            const apiUrl = "https://api.mistral.ai/v1/chat/completions";
            const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(apiUrl);

            const res = await fetch(proxyUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [...chatHistory, {role: "user", content: text}],
                    max_tokens: 100,    
                    temperature: 0.7    
                })
            });

            if(typingRow) typingRow.remove();

            // FIX: Print the exact error to the user if Mistral rejects it
            if(!res.ok) {
                if (res.status === 401 || res.status === 402) {
                    addBubbleRow("Error 401: Mistral blocked the key. You may need to add a billing card to your Mistral account to activate the free tier. 💳", "ai");
                } else if (res.status === 429) {
                    addBubbleRow("Error 429: Too many requests or out of credits! 🐢", "ai");
                } else {
                    addBubbleRow(`API Error Code: ${res.status}. 🛑`, "ai");
                }
                return;
            }
            
            const data = await res.json();
            const reply = data.choices[0].message.content;
            
            chatHistory.push({role: "user", content: text}, {role: "assistant", content: reply});
            addBubbleRow(reply, 'ai');

        } catch(e) {
            if(typingRow) typingRow.remove();
            console.error(e);
            addBubbleRow("Browser Block (CORS). We need to move this API call to a backend server to work safely! 🛡️", "ai");
        }
    }

    if (micBtn && chatInput) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            micBtn.addEventListener('click', () => {
                recognition.start();
                micBtn.style.color = "var(--orange)"; 
                chatInput.placeholder = "Listening...";
            });

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                chatInput.value = transcript;
                handleSend(); 
            };

            recognition.onspeechend = () => {
                recognition.stop();
                micBtn.style.color = "";
                chatInput.placeholder = "Ask about our menu...";
            };

            recognition.onerror = () => {
                micBtn.style.color = "";
                chatInput.placeholder = "Mic error. Try typing!";
            };
        } else {
            micBtn.style.display = "none"; 
        }
    }

    if(sendBtn) sendBtn.addEventListener('click', handleSend);
    
    // Global safety check for Enter key
    if(chatInput) {
        chatInput.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter') handleSend(); 
        });
    }

    if (clearChatBtn && chatMessages) {
        clearChatBtn.addEventListener('click', () => {
            chatHistory = [{ role: "system", content: SYSTEM_PROMPT }];
            chatMessages.innerHTML = '';
            addBubbleRow("Hi! I'm the Pinhole Assistant. How can I help you today? ☕", "ai");
        });
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

document.querySelector('.close-lightbox').onclick = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('modal-open'); // Restarts background animations
    document.body.style.overflow = 'auto';
};

}); // End of File