// Восстановление контактов и футера в исходное состояние
document.addEventListener('DOMContentLoaded', function() {
    // Восстанавливаем секцию контактов
    const contactSection = document.querySelector('#contact .container');
    if (contactSection) {
        const contactContent = contactSection.querySelector('.contact-content');
        if (contactContent) {
            contactContent.outerHTML = `
                <div class="contact-content">
                    <div class="contact-info">
                        <h3>Наши контакты</h3>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <strong>Телефон:</strong>
                                <p>+7 (999) 123-45-67</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Email:</strong>
                                <p>info@worldtravel.com</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Адрес:</strong>
                                <p>Москва, ул. Туристическая, 15</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Часы работы:</strong>
                                <p>Пн-Пт: 9:00-18:00</p>
                            </div>
                        </div>
                    </div>
                    <form class="contact-form">
                        <input type="text" placeholder="Ваше имя" required>
                        <input type="email" placeholder="Ваш email" required>
                        <input type="tel" placeholder="Ваш телефон">
                        <textarea placeholder="Ваше сообщение" rows="5" required></textarea>
                        <button type="submit">Отправить сообщение</button>
                    </form>
                </div>
            `;
        }
    }

    // Восстанавливаем футер
    const footerContent = document.querySelector('.footer-content');
    if (footerContent) {
        footerContent.outerHTML = `
            <div class="footer-content">
                <div class="footer-section">
                    <h3><i class="fas fa-globe-americas"></i> WorldTravel</h3>
                    <p>Ваш надежный партнер в мире путешествий. Мы делаем ваши мечты о путешествиях реальностью.</p>
                </div>
                <div class="footer-section">
                    <h4>Быстрые ссылки</h4>
                    <ul>
                        <li><a href="#home">Главная</a></li>
                        <li><a href="#about">О нас</a></li>
                        <li><a href="#services">Услуги</a></li>
                        <li><a href="#destinations">Направления</a></li>
                        <li><a href="#contact">Контакты</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Контакты</h4>
                    <p><i class="fas fa-phone"></i> +7 (999) 123-45-67</p>
                    <p><i class="fas fa-envelope"></i> info@worldtravel.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> Москва, ул. Туристическая, 15</p>
                    <p><i class="fas fa-clock"></i> Пн-Пт: 9:00-18:00</p>
                </div>
            </div>
        `;
    }
});
