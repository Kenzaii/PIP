class Calendar {
    constructor() {
        // Get current date and explicitly set it
        const today = new Date();
        this.date = today;
        this.currentMonth = today.getMonth(); // This will be 0-11
        this.currentYear = today.getFullYear();
        
        console.log('Initializing calendar:', {
            month: this.currentMonth,
            year: this.currentYear
        });
        
        // Define events with 2025 date
        this.events = {
            '2025-02-15': {
                title: 'Investors Appreciation Pool Party',
                description: 'Join us for an exclusive pool party'
            }
        };
        
        // Debug log the events
        console.log('Events initialized:', this.events);
        
        // Immediately render the calendar
        this.init();
    }

    init() {
        // Force immediate render
        this.renderCalendar();
        this.addEventListeners();
    }

    renderCalendar() {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Debug log
        console.log('Rendering calendar for:', months[this.currentMonth], this.currentYear);

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);
        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;

        // Update header
        const headerElement = document.querySelector('.calendar-header h3');
        if (headerElement) {
            headerElement.innerHTML = `${months[this.currentMonth]} ${this.currentYear}`;
        }

        let days = "";

        // Previous month's days
        for (let x = firstDayIndex; x > 0; x--) {
            days += `<div class="calendar-day disabled">${prevLastDay.getDate() - x + 1}</div>`;
        }

        // Current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            // Format date string to match events object format
            const month = String(this.currentMonth + 1).padStart(2, '0');
            const day = String(i).padStart(2, '0');
            const dateStr = `${this.currentYear}-${month}-${day}`;
            
            // Special debug for February 15th
            if (this.currentMonth === 1 && i === 15) {
                console.log('February 15th check:', {
                    dateStr: dateStr,
                    hasEvent: !!this.events[dateStr],
                    eventData: this.events[dateStr]
                });
            }

            const isToday = i === this.date.getDate() && 
                           this.currentMonth === this.date.getMonth() && 
                           this.currentYear === this.date.getFullYear();
            
            // Check for event
            const event = this.events[dateStr];
            
            if (event) {
                console.log(`Event found for ${dateStr}:`, event);
                days += `
                    <div class="calendar-day has-event ${isToday ? 'today' : ''}">${i}
                        <div class="event-indicator">
                            <span class="event-dot"></span>
                            <div class="event-popup">
                                <h4>${event.title}</h4>
                                <p>${months[this.currentMonth]} ${i}, ${this.currentYear}</p>
                                <p class="event-description">${event.description}</p>
                            </div>
                        </div>
                    </div>`;
            } else {
                days += `<div class="calendar-day ${isToday ? 'today' : ''}">${i}</div>`;
            }
        }

        // Next month's days
        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="calendar-day disabled">${j}</div>`;
        }

        // Update calendar days
        const daysElement = document.querySelector('.calendar-days');
        if (daysElement) {
            daysElement.innerHTML = days;
        }

        // Debug log for events
        console.log('Current month events:', {
            month: this.currentMonth + 1,
            year: this.currentYear,
            events: this.events
        });
    }

    addEventListeners() {
        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.renderCalendar();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.renderCalendar();
            });
        }
    }

    addEvent(date, title, description) {
        this.events[date] = { title, description };
        this.renderCalendar();
    }
}

// Create calendar instance after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the calendar elements exist before creating the instance
    if (document.querySelector('.calendar-wrapper')) {
        window.calendar = new Calendar();
        
        // Debug check for February event
        console.log('Calendar events after initialization:', window.calendar.events);
    } else {
        console.error('Calendar wrapper element not found');
    }
}); 