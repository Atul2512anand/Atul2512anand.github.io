import { PROFILE } from '../constants';

const Tools = () => {
  const repeated = [...PROFILE.tools, ...PROFILE.tools];

  return (
    <section className="tools-strip" id="tools" aria-label="Tools and technologies">
      <div className="marquee">
        <div className="marquee-track">
          {repeated.map((tool, index) => (
            <span
              className="marquee-item mono"
              key={`${tool}-${index}`}
              aria-hidden={index >= PROFILE.tools.length}
            >
              {tool}
              <span className="marquee-star" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
