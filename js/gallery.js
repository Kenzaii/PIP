class Gallery {
    constructor() {
        this.galleries = {};
        this.currentFilters = {
            year: 'all',
            month: 'all'
        };
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupLightbox();
    }

    setupFilters() {
        const yearFilter = document.getElementById('yearFilter');
        const monthFilter = document.getElementById('monthFilter');

        yearFilter.addEventListener('change', (e) => {
            this.currentFilters.year = e.target.value;
            this.filterGalleries();
        });

        monthFilter.addEventListener('change', (e) => {
            this.currentFilters.month = e.target.value;
            this.filterGalleries();
        });
    }

    setupLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="" alt="Gallery Image">
        `;
        document.body.appendChild(lightbox);

        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-image')) {
                const img = e.target.closest('.gallery-image').querySelector('img');
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightbox.querySelector('img')) {
                lightbox.classList.remove('active');
            }
        });
    }

    addGallery(date, images) {
        const [year, month] = date.split('-');
        if (!this.galleries[year]) {
            this.galleries[year] = {};
        }
        if (!this.galleries[year][month]) {
            this.galleries[year][month] = [];
        }
        this.galleries[year][month] = [...this.galleries[year][month], ...images];
        this.renderGalleries();
    }

    filterGalleries() {
        const folders = document.querySelectorAll('.gallery-folder');
        folders.forEach(folder => {
            const year = folder.dataset.year;
            const month = folder.dataset.month;
            const showYear = this.currentFilters.year === 'all' || this.currentFilters.year === year;
            const showMonth = this.currentFilters.month === 'all' || this.currentFilters.month === month;
            folder.style.display = showYear && showMonth ? 'block' : 'none';
        });
    }

    renderGalleries() {
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = '';

        Object.entries(this.galleries)
            .sort(([yearA], [yearB]) => yearB - yearA)
            .forEach(([year, months]) => {
                Object.entries(months)
                    .sort(([monthA], [monthB]) => monthB - monthA)
                    .forEach(([month, images]) => {
                        const folder = this.createGalleryFolder(year, month, images);
                        galleryGrid.appendChild(folder);
                    });
            });
    }

    createGalleryFolder(year, month, images) {
        const folder = document.createElement('div');
        folder.className = 'gallery-folder';
        folder.dataset.year = year;
        folder.dataset.month = month;

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        folder.innerHTML = `
            <h3>${monthNames[parseInt(month) - 1]} ${year}</h3>
            <div class="gallery-images">
                ${images.map(image => `
                    <div class="gallery-image">
                        <img src="${image.url}" alt="${image.description || ''}">
                    </div>
                `).join('')}
            </div>
        `;

        return folder;
    }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
    
    // Example usage (remove this when adding real images):
    gallery.addGallery('2025-02', [
        { url: 'path/to/image1.jpg', description: 'Description 1' },
        { url: 'path/to/image2.jpg', description: 'Description 2' }
    ]);
}); 