document.addEventListener('DOMContentLoaded', function() {
    const pasteTitle = document.getElementById('pasteTitle');
    const pasteContent = document.getElementById('pasteContent');
    const saveButton = document.getElementById('saveButton');
    const savedPastes = document.getElementById('savedPastes');
    let pastes = loadPastes();

    function loadPastes() {
        let storedPastes = localStorage.getItem('pastes');
        if (storedPastes) {
            storedPastes = JSON.parse(storedPastes);
            return storedPastes.filter(paste => new Date(paste.expiration) > new Date());
        }
        return [];
    }

    function savePastes() {
        localStorage.setItem('pastes', JSON.stringify(pastes));
    }

    function renderPastes() {
        savedPastes.innerHTML = '';
        pastes.forEach((paste, index) => {
            const pasteElement = document.createElement('div');
            pasteElement.className = 'paste-item';
            pasteElement.innerHTML = `
                <div>
                    <h5 class="card-title">${paste.title}</h5>
                    <p class="card-text">${paste.content.replace(/\n/g, '<br>').slice(0, 50)}${paste.content.length > 50 ? '...' : ''}</p>
                    <div class="paste-actions">
                        <button class="btn btn-modern btn-edit btn-sm" data-index="${index}">Edit</button>
                        <button class="btn btn-modern btn-delete btn-sm" data-index="${index}">Delete</button>
                        <button class="btn btn-modern btn-view btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal" data-index="${index}">View</button>
                    </div>
                </div>
            `;
            savedPastes.appendChild(pasteElement);
        });
    }

    saveButton.addEventListener('click', function() {
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 3);
        pastes.push({
            title: pasteTitle.value,
            content: pasteContent.value,
            expiration: expirationDate.toISOString()
        });
        savePastes();
        renderPastes();
        // Clear input fields after saving
        pasteTitle.value = '';
        pasteContent.value = '';
    });

    savedPastes.addEventListener('click', function(event) {
        const index = event.target.getAttribute('data-index');
        if (event.target.classList.contains('btn-edit')) {
            // Populate the fields with the paste data for editing
            pasteTitle.value = pastes[index].title;
            pasteContent.value = pastes[index].content;
            // Remove the old paste from the array
            pastes.splice(index, 1);
            savePastes();
            renderPastes();
            // Focus on the title input to start editing
            pasteTitle.focus();
        } else if (event.target.classList.contains('btn-delete')) {
            pastes.splice(index, 1);
            savePastes();
            renderPastes();
        } else if (event.target.classList.contains('btn-view')) {
            const modalTitle = document.getElementById('viewModalLabel');
            const modalContent = document.querySelector('#viewModal pre');
            modalTitle.textContent = pastes[index].title;
            modalContent.textContent = pastes[index].content;
            const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
            viewModal.show();
            
            // Refresh the page when the modal is closed
            document.getElementById('viewModal').addEventListener('hidden.bs.modal', function() {
                location.reload();
            }, { once: true });
        }
    });

    renderPastes();
});