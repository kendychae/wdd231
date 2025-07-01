document.addEventListener("DOMContentLoaded", () => {
    // Footer year and last modified
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("last-modified").textContent = document.lastModified;
  
    // Your actual course list
    const courses = [
      { code: "CSE 110", name: "Programming with Classes", subject: "Programming", credits: 2, completed: true },
      { code: "WDD 231", name: "Web Frontend Development I", subject: "Web", credits: 2, completed: true },
      { code: "WDD 330", name: "Web Frontend Development II", subject: "Web", credits: 2, completed: false },
      { code: "CSE 340", name: "Web Backend Development", subject: "Programming", credits: 3, completed: false },
      { code: "GS 170", name: "Career Development", subject: "UX", credits: 1, completed: true }
    ];
  
    const courseList = document.getElementById("course-list");
    const totalCredits = document.getElementById("total-credits");
    const filterButtons = document.querySelectorAll("#filter-buttons button");
  
    // Function to render the courses based on subject
    function renderCourses(list) {
      courseList.innerHTML = "";
      let total = 0;
  
      list.forEach((course) => {
        const li = document.createElement("li");
        li.textContent = `${course.code}: ${course.name} (${course.credits} credits)`;
        if (course.completed) {
          li.classList.add("completed");
        }
        courseList.appendChild(li);
        total += course.credits;
      });
  
      totalCredits.textContent = total;
    }
  
    // Add click event to each filter button
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const subject = btn.dataset.subject;
        const filtered = subject === "All" ? courses : courses.filter((c) => c.subject === subject);
        renderCourses(filtered);
      });
    });
  
    // Initial display of all courses
    renderCourses(courses);
  });
  