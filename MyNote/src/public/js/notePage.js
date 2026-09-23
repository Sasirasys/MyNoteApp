const userService_url = `http://localhost:3002`;

const getNoteList = async () => {
  try {
    const url = `${userService_url}/note/readList`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const { data: noteList } = await response.json();

    const container = document.getElementById("notes-container");
    container.innerHTML = "";
    noteList.forEach((noteData) => {
      const noteHTML = `
        <div class="note-item" data-id="${noteData._id}" onclick="setActiveNote(this)">
              <div class="note-item-title">${noteData.title}</div>
              <div class="note-item-snippet">${noteData.content}</div>
              <div class="date-text align-right">${noteData.createdAt}</div>
        </div>
        `;
      container.insertAdjacentHTML("beforeend", noteHTML);
    });
  } catch (e) {
    console.error("Failed to load notes", e);
  }
};

function setActiveNote(element) {
  const currentActive = document.querySelector(".note-item.active");
  if (currentActive) {
    currentActive.classList.remove("active");
  }

  element.classList.add("active");

  const noteId = element.getAttribute("data-id");
  fetchNoteDetails(noteId);
}

function fetchNoteDetails(noteId) {
  return;
}

$(document).ready(function () {
  getNoteList();
});
