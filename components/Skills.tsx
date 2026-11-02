import { FOCUS_AREAS, SKILL_GROUPS } from '../constants';

const Skills = () => (
  <section className="band band--green band--skills" id="skills" aria-labelledby="skills-title">
    <div className="container">
      <div className="section-head" data-reveal>
        <div>
          <div className="section-eyebrow mono">
            <span>04</span> Toolkit
          </div>
          <h2 className="section-title" id="skills-title">
            The stack behind the <span className="scribble">paranoia.</span>
          </h2>
        </div>
        <p className="section-note">
          Languages, models and infrastructure I reach for — from quick scripts to deployed
          systems. If it touches data, networks or a browser, it&apos;s probably in here.
        </p>
      </div>

      <div className="skill-grid">
        {SKILL_GROUPS.map((group, index) => (
          <div
            className="skill-col"
            key={group.category}
            data-reveal
            style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }}
          >
            <h3 className="skill-cat mono">{group.category}</h3>
            <ul className="skill-list">
              {group.items.map((item) => (
                <li className="skill-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="focus-block" data-reveal>
        <span className="focus-label mono">Focus areas</span>
        <div className="focus-row">
          {FOCUS_AREAS.map((area) => (
            <span className="focus-item" key={area}>
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
