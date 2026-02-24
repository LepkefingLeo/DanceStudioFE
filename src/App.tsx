import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";

type Course = {
  id: string;
  name: string;
  length: string;
  type: string;
  instructor: string;
};

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [applyStatus, setApplyStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  const handleApply = async (courseId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/courses/${courseId}/apply`,
        { method: "POST" },
      );
      if (res.ok) {
        setApplyStatus((prev) => ({
          ...prev,
          [courseId]: "Sikeres jelentkezés!",
        }));
      } else {
        const err = await res.json();
        setApplyStatus((prev) => ({
          ...prev,
          [courseId]: err.message || "Hiba történt.",
        }));
      }
    } catch {
      setApplyStatus((prev) => ({ ...prev, [courseId]: "Hiba történt." }));
    }
  };

  return (
    <>
      <div className="main">
        <div className="links" style={{ marginTop: "30px" }}>
          <a
            style={{
              textDecoration: "none",
              marginLeft: "300px",
              marginRight: "15px",
            }}
            href="#Elérhetőség"
          >
            Elérhetőség
          </a>
          <a style={{ textDecoration: "none" }} href="https://petrik.hu/">
            Petrik honlap
          </a>
        </div>

        <h1
          style={{
            fontSize: "24px",
            fontFamily: "Arial",
            fontWeight: "normal",
            marginTop: "15px",
            marginBottom: "40px",
            marginLeft: "250px"
          }}
        >
          Petrik Könyvklub
        </h1>

        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            {courses.map((course) => {
              let imageSrc = "";
              if (course.type === "solo") {
                imageSrc = "./src/assets/solo.svg";
              } else if (course.type === "group") {
                imageSrc = "./src/assets/group.svg";
              } else if (course.type === "partner") {
                imageSrc = "./src/assets/partner.svg";
              }

              return (
                <div className="course-card" key={course.id}>
                  <h2>{course.name}</h2>
                  <img
                    src={imageSrc}
                    alt="Kurzus típus"
                    className="course-image"
                    style={{ width: "18rem" }}
                  />
                  <p>
                    <b>Egy alkalom hossza:</b> {course.length} perc
                  </p>
                  <p>
                    <b>Tánctanár:</b> {course.instructor}
                  </p>
                  <button onClick={() => handleApply(course.id)}>
                    Jelentkezés
                  </button>
                  {applyStatus[course.id] && (
                    <div className="apply-status">{applyStatus[course.id]}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div id="Elérhetőség">
          <p>
            Cím: 1440 Budapest, Ady Endre utca 2-4. <br />
            Telefon: +36 40 123 4567 <br />
            Készítette: Hegedűs Péter
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
