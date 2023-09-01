const unreadContainer = document.querySelectorAll(".unread > .n-left > p");
const markRead = document.getElementById("mark-read");
const noteNumber = document.getElementById("note-number");
const markThisRead = document.getElementsByClassName("mark-this-read");
const removeNotif = document.getElementsByClassName("remove-notif");
let emptyMessage = "You don't have any notifications. Maybe make some more friends?";

// Function to add red circles to unread notifications
function circulize() {
    for (let i = 0; i < unreadContainer.length; i++) {
        if (unreadContainer[i].closest('.notification').classList.contains("unread")) {
            let circle = document.createElement('span');
            circle.className = "red-circle";
            unreadContainer[i].appendChild(circle);
        }
    }
}

// Function to update the note count
function updateNoteNumber() {
    const unreadCount = document.querySelectorAll('.unread.notification').length;
    noteNumber.innerHTML = unreadCount;
}

// Function to mark all notifications as read
function markAsRead() {
    const redCircles = document.querySelectorAll('.red-circle');
    redCircles.forEach(circle => {
        circle.parentNode.removeChild(circle);
    });

    // Update the classes of notifications
    const unread = document.querySelectorAll('.unread.notification');
    for (let i = 0; i < unread.length; i++) {
        const notification = unread[i];
        notification.classList.remove('unread');
        notification.classList.add('read');
        const markAsReadButton = notification.querySelector('.mark-this-read');
        markAsReadButton.textContent = 'Mark As Unread';
        const markAsUnreadIcon = document.createElement('i');
        markAsUnreadIcon.className = 'fa fa-check';
        markAsReadButton.insertBefore(markAsUnreadIcon, markAsReadButton.firstChild);
    }

    circulize(); // Recreate red circles for unread notifications
    updateNoteNumber(); // Update the noteNumber immediately after the changes
}

function removeNotification(notification) {
    notification.remove();
    updateNoteNumber(); // Update noteNumber immediately
    checkNotifications(); // Check if any notifications are left
}

function checkNotifications() {
    const mainContainer = document.querySelector('main');
    if (document.querySelectorAll('.notification').length === 0) {
        // Display the stored message when no notifications are left
        mainContainer.innerHTML = `<div class="top-head">
        <div id="head-left">
          <h1>Notifications</h1>
          <span id="note-number">0</span>
        </div>
        <div class="all-buttons">
          <span id="mark-read" onclick="markAsRead()">Mark all as read</span>
          <span id="separate" style="padding-inline: 5px"> | </span>
          <span id="remove-all" onclick="removeAll()">Remove all</span>
        </div>
      </div><div class="no-notifications">${emptyMessage}</div>`;
    }
}

function removeAll() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        notification.remove();
    });

    updateNoteNumber(); // Update noteNumber immediately
    checkNotifications(); // Check if any notifications are left
}

// Add event listeners after the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Update the note count
    updateNoteNumber();

    const notifications = document.querySelectorAll('.notification');

    // Set up interactions for each notification
    notifications.forEach(notification => {
        const settings = notification.querySelector(".settings");
        const dropdown = notification.querySelector(".dd");
        const markAsReadButton = notification.querySelector(".mark-this-read");
        const removeNotificationButton = notification.querySelector(".remove-notif");

        // Show settings div on mouse over
        notification.addEventListener("mouseover", () => {
            settings.style.display = "block";
        });

        // Hide settings div if dropdown is closed
        notification.addEventListener("mouseleave", () => {
            if (dropdown.style.display !== "flex") {
                settings.style.display = "none";
            }
        });

        // Show dropdown when settings icon is clicked
        settings.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdown.style.display = "flex";
        });

        // Show settings and dropdown when hovering over dropdown area
        dropdown.addEventListener("mouseenter", () => {
            dropdown.style.display = "flex";
            settings.style.display = "block";
        });

        // Hide settings and dropdown when not hovering over dropdown area
        dropdown.addEventListener("mouseleave", () => {
            dropdown.style.display = "none";
            settings.style.display = "none";
        });

        // Mark individual notification as read/unread when button is clicked
        markAsReadButton.addEventListener("click", () => {
            const notificationContainer = notification.closest('.notification');
            const isRead = notificationContainer.classList.contains("read");
        
            if (isRead) {
                notificationContainer.classList.remove("read");
                notificationContainer.classList.add("unread");
                markAsReadButton.innerHTML = '<i class="fa fa-check"></i> Mark As Read';
                const circle = document.createElement('span');
                circle.className = "red-circle";
                notificationContainer.querySelector('.n-left > p').appendChild(circle);
            } else {
                notificationContainer.classList.remove("unread");
                notificationContainer.classList.add("read");
                markAsReadButton.textContent = "";
                const markAsUnreadIcon = document.createElement('i');
                markAsUnreadIcon.className = "fa fa-check";
                markAsReadButton.appendChild(markAsUnreadIcon);
                markAsReadButton.insertAdjacentText('beforeend', ' Mark As Unread');
                const redCircle = notificationContainer.querySelector('.red-circle');
                if (redCircle) {
                    redCircle.remove();
                }
            }
        
            updateNoteNumber(); // Update noteNumber immediately
        });
        
        // Attach removeNotification function to "Remove Notification" button
        removeNotificationButton.addEventListener("click", () => {
            const notificationContainer = notification.closest('.notification');
            removeNotification(notificationContainer);
        });
    });

     // Attach removeAll function to "Remove all" button
     const removeAllButton = document.getElementById("remove-all");
     removeAllButton.addEventListener("click", removeAll);
});

// Call circulize after the page is fully loaded
window.addEventListener('load', circulize);

// Call markAsRead function when "Mark all as read" is clicked
markRead.addEventListener("click", markAsRead);

// Call updateNoteNumber after the page is fully loaded
window.addEventListener('load', updateNoteNumber);
