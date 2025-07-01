document.addEventListener('DOMContentLoaded', () => {
    // Footer year and last modified
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
  
    // Course data array
    const courses = [
      { code: "WDD 130", name: "Web Fundamentals", subject: "Web", credits: 3, completed: true },
      { code: "WDD 230", name: "Frontend Development I", subject: "Web", credits: 3, completed: true },
      { code: "WDD 231", name: "Frontend Development II", subject: "Web", credits: 3, completed: false },
      { code: "CSE 110", name: "Programming Basics", subject: "Programming", credits: 2, completed: true },
      { code: "CSE 111", name: "Programming with Functions", subject: "Programming", credits: 3, completed: true },
      { code: "UXD 100", name: "User Experience Design", subject: "UX", credits: 2, completed: false },
    ];
  
    const courseList = document.getElementById("course-list");
    const totalCreditsEl = document.getElementById("total-credits");
    const filterButtons = document.querySelectorAll("#filter-buttons button");
  
    function displayCourses(filteredCourses) {
      courseList.innerHTML = "";
  
      filteredCourses.forEach(course => {
        const li = document.createElement("li");
        li.textContent = `${course.code}: ${course.name} (${course.credits} credits)`;
        if (course.completed) {
          li.classList.add("completed");
        }
        courseList.appendChild(li);
      });
  
      const total = filteredCourses.reduce((sum, c) => sum + c.credits, 0);
      totalCreditsEl.textContent = total;
    }
  
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const subject = btn.dataset.subject;
        if (subject === "All") {
          displayCourses(courses);
        } else {
          const filtered = courses.filter(c => c.subject === subject);
          displayCourses(filtered);
        }
      });
    });
  
    // Initial display
    displayCourses(courses);
  });
  