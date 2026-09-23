const noteService_url = `http://localhost:3002`;

const getNoteList = async () => {
  try {
    const url = `${noteService_url}/note/readList`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const { data: noteList } = await response.json();

    const currentActive = document.querySelector(".note-item.active");
    let currentActiveId;
    if (currentActive) {
      currentActiveId = currentActive.getAttribute("data-id");
    }

    const container = document.getElementById("notes-container");
    container.innerHTML = "";
    noteList.forEach((noteData) => {
      const activeClass = noteData._id == currentActiveId ? "active" : "";
      const noteHTML = `
        <div class="note-item ${activeClass}" data-id="${noteData._id}" onclick="setActiveNote(this)">
              <div class="note-item-title">${noteData.title}</div>
              <div class="note-item-snippet">${noteData.content}</div>
              <div class="date-text align-right">${formatISODate(noteData.createdAt)}</div>
        </div>
        `;
      container.insertAdjacentHTML("beforeend", noteHTML);
    });
  } catch (e) {
    console.error("Failed to load notes", e);
  }
};

const saveChanges = async (title, content) => {
  try {
    const currentActive = document.querySelector(".note-item.active");
    if (!currentActive) {
      saveNewNote(title, content);
      return;
    }

    const currentActiveId = currentActive.getAttribute("data-id");
    const url = `${noteService_url}/note/update/${currentActiveId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
    if (!response.ok) throw new Error(response.error);

    getNoteList();
  } catch (e) {
    console.error("Failed to save note", e);
  }
};

const saveNewNote = async (title, content) => {
  try {
    const url = `${noteService_url}/note/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
    if (!response.ok) throw new Error(response.error);
    const data = await response.json();

    await getNoteList();

    const currentElement = document.querySelector(
      `[data-id="${data.data._id}"]`,
    );
    setActiveNote(currentElement);
  } catch (e) {
    console.error("Failed to create new note", e);
  }
};

function setActiveNote(element) {
  const currentActive = document.querySelector(".note-item.active");
  if (currentActive) {
    currentActive.classList.remove("active");
  }

  if (!element) return;
  element.classList.add("active");

  const noteId = element.getAttribute("data-id");
  fetchNoteDetails(noteId);
}

async function fetchNoteDetails(noteId) {
  try {
    const url = `${noteService_url}/note/read/${noteId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const { data } = await response.json();
    const createDate = document.getElementById("create-date");
    const modifyDate = document.getElementById("modify-date");
    const title = document.getElementById("note-title-input");
    const content = document.getElementById("note-body-textarea");
    createDate.textContent = formatISODate(data.createdAt);
    modifyDate.textContent = formatISODate(data.lastModified);
    title.value = data.title;
    content.value = data.content;
  } catch (e) {
    console.error("Failed to load note data", e);
  }
}

function formatISODate(isoString) {
  const date = new Date(isoString);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

$(document).ready(function () {
  getNoteList();

  $("#save-button").on("click", (event) => {
    event.preventDefault(); // Stops the button from refreshing the page

    const title = $("#note-title-input").val();
    const content = $("#note-body-textarea").val();

    saveChanges(title, content);
  });

  $("#new-note-button").on("click", (event) => {
    event.preventDefault();

    setActiveNote();
    document.getElementById("note-title-input").value = "";
    document.getElementById("note-body-textarea").value = "";
  });
});
