// script.js
document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
  
    function showAddForm() {
      contentDiv.innerHTML = `
        <h2>Add Event</h2>
        <form id="addForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" class="form-control" id="address" name="address" required>
          </div>
          <div class="form-group">
            <label for="room">Room</label>
            <input type="text" class="form-control" id="room" name="room" required>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      `;
    }
  
    // ... (Other showXXXForm functions)
  
    function handleNavbarClick(event) {
      const target = event.target;
      if (target.tagName === 'A') {
        const selectedOption = target.getAttribute('id');
  
        if (selectedOption === 'showAddForm') {
          showAddForm();
        } else if (selectedOption === 'showDeleteForm') {
          showDeleteForm();
        } else if (selectedOption === 'showUpdateForm') {
          showUpdateForm();
        } else if (selectedOption === 'showAllEvents') {
          showAllEvents();
        } else if (selectedOption === 'showFindForm') {
          showFindForm();
        }
      }
    }
  
    document.querySelector('.navbar-nav').addEventListener('click', handleNavbarClick);
  
    // Handle form submissions
    contentDiv.addEventListener('submit', event => {
      event.preventDefault();
      const formId = event.target.id;
      const formData = new FormData(event.target);
  
      if (formId === 'addForm') {
        // Handle addForm submission (POST request)
        const name = formData.get('name');
        const address = formData.get('address');
        const room = formData.get('room');
  
        // Perform POST request to add the new event
        fetch('/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, address, room }),
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response here (e.g., show success message)
            console.log(data);
          })
          .catch(error => {
            // Handle errors here (e.g., show error message)
            console.error('Error adding event:', error);
          });
      } else if (formId === 'deleteForm') {
        // Handle deleteForm submission (POST request)
        const eventId = formData.get('eventId');
  
        // Perform POST request to delete the event
        fetch(`/events/${eventId}/delete`, {
          method: 'POST',
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response here (e.g., show success message)
            console.log(data);
          })
          .catch(error => {
            // Handle errors here (e.g., show error message)
            console.error('Error deleting event:', error);
          });
      } else if (formId === 'updateForm') {
        // Handle updateForm submission (POST request)
        const eventId = formData.get('eventId');
        // Add fields to update here based on your requirements
  
        // Perform POST request to update the event
        fetch(`/events/${eventId}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ /* Add updated fields here */ }),
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response here (e.g., show success message)
            console.log(data);
          })
          .catch(error => {
            // Handle errors here (e.g., show error message)
            console.error('Error updating event:', error);
          });
      } else if (formId === 'findForm') {
        // Handle findForm submission (GET request)
        const eventName = formData.get('eventName');
  
        // Perform GET request to find the event(s) with the given name
        fetch(`/events?name=${eventName}`)
          .then(response => response.json())
          .then(data => {
            // Handle the response here (e.g., display the found events)
            console.log(data);
          })
          .catch(error => {
            // Handle errors here (e.g., show error message)
            console.error('Error finding events:', error);
          });
      }
    });
  });