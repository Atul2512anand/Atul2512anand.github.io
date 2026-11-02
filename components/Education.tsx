import { COURSES, EDUCATION } from '../constants';

const splitScore = (score?: string) => {
  if (!score) return null;
  const match = score.match(/^([\d.]+)(.*)$/);
  return match ? { value: match[1], suffix: match[2] } : { value: score, suffix: '' };
};

const Education = () => (
  <section
    className="band band--blue band--education"
    id="education"
    aria-labelledby="education-title"
  >
    <div className="container">
      <div className="section-head" data-reveal>
        <div>
          <div className="section-eyebrow mono">
            <span>05</span> Education
          </div>
          <h2 className="section-title" id="education-title">
            The paper <span className="scribble">trail.</span>
          </h2>
        </div>
        <p className="section-note">
          A consistently high GPA, an Institute of National Importance, and enough coursework to
          understand how systems actually fail.
        </p>
      </div>

      <div className="edu-grid">
        {EDUCATION.map((edu, index) => {
          const score = splitScore(edu.score);
          return (
            <article
              className="edu-card"
              key={edu.id}
              data-reveal
              style={{ transitionDelay: `${Math.min(index * 70, 210)}ms` }}
            >
              {edu.label && <span className="edu-label mono">{edu.label}</span>}
              {score && (
                <div className="edu-score">
                  {score.value}
                  <span className="edu-suffix">{score.suffix}</span>
                </div>
              )}
              <h3 className="edu-degree">{edu.degree}</h3>
              <p className="edu-school">{edu.institution}</p>
              <span className="edu-period mono">{edu.period}</span>
            </article>
          );
        })}
      </div>

      <div className="coursework" data-reveal>
        <div className="coursework-head">
          <span className="mono">Relevant coursework</span>
          <p>The parts of the syllabus that turned into how I work.</p>
        </div>
        <ul className="course-list">
          {COURSES.map((course) => {
            const ongoing = course.endsWith('*');
            return (
              <li className="course-item" key={course}>
                <span>{course.replace(/\*$/, '')}</span>
                {ongoing && (
                  <span className="course-ongoing mono" title="Ongoing">
                    ongoing
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </section>
);

export default Education;
