// Socket.io bağlantısı
const socket = io();

// DOM elementleri
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.chat-input button');

// Chat fonksiyonları
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addUserMessage(message);
        socket.emit('ai-question', { question: message });
        chatInput.value = '';
        
        // AI yanıtı gelene kadar loading göster
        addLoadingMessage();
    }
}

function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message fade-in';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addAIMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message fade-in';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message fade-in';
    loadingDiv.innerHTML = '<span class="loading"></span> Yapay zeka düşünüyor...';
    loadingDiv.id = 'loading-message';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Socket event listeners
socket.on('ai-response', (data) => {
    removeLoadingMessage();
    addAIMessage(data.answer);
});

// Event listeners
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Quiz fonksiyonları
let currentQuestion = 0;
let score = 0;
let quizData = [];

function loadQuiz(ders, konu) {
    // Quiz verilerini yükle (simülasyon)
    quizData = [
        {
            question: "Fotosentez hangi organeld gerçekleşir?",
            options: ["Mitokondri", "Kloroplast", "Ribozom", "Çekirdek"],
            correct: 1
        },
        {
            question: "Su molekülünün kimyasal formülü nedir?",
            options: ["H2O", "CO2", "O2", "N2"],
            correct: 0
        },
        {
            question: "Işık hızı nedir?",
            options: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "1.000.000 km/s"],
            correct: 0
        }
    ];
    
    currentQuestion = 0;
    score = 0;
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestion >= quizData.length) {
        showResults();
        return;
    }
    
    const question = quizData[currentQuestion];
    const questionElement = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options');
    
    questionElement.textContent = `Soru ${currentQuestion + 1}: ${question.question}`;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    updateProgress();
}

function selectOption(selectedIndex) {
    const question = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => option.onclick = null);
    
    if (selectedIndex === question.correct) {
        options[selectedIndex].classList.add('correct');
        score++;
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuestion++;
        displayQuestion();
    }, 2000);
}

function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function showResults() {
    const quizContainer = document.querySelector('.quiz-container');
    const percentage = (score / quizData.length) * 100;
    
    quizContainer.innerHTML = `
        <div class="results fade-in">
            <h2>Quiz Tamamlandı!</h2>
            <div class="score-display">
                <p>Doğru Sayısı: ${score}/${quizData.length}</p>
                <p>Başarı Oranı: %${percentage.toFixed(1)}</p>
            </div>
            <div class="result-message">
                ${percentage >= 80 ? '🎉 Harika iş!' : percentage >= 60 ? '👍 İyi çalışma!' : '💪 Daha fazla çalışmalısın!'}
            </div>
            <button class="btn btn-primary" onclick="location.reload()">Tekrar Dene</button>
        </div>
    `;
}

// Video player controls
function initVideoPlayer() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            // Video yüklenmesini optimize et
            iframe.loading = 'lazy';
            
            // Video başlat/durdur kontrolleri
            container.addEventListener('click', () => {
                if (iframe.src.includes('autoplay=0')) {
                    iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
                }
            });
        }
    });
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Page load animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade-in animasyonları
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
    
    // Initialize components
    initVideoPlayer();
    initSmoothScroll();
    initLazyLoading();
});

// Theme toggle (isteğe bağlı)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for quick search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Search modal'ını aç
        openSearchModal();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Search functionality
function openSearchModal() {
    // Search modal implementasyonu
    console.log('Search modal açılıyor...');
}

function closeAllModals() {
    // Tüm modalları kapat
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}
