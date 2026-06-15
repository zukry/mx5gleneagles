export default function Submit() {
  return (
    <main>
      <section className="pageHeader">
        <p className="eyebrow">Submit</p>
        <h1>Submit a car</h1>
        <p>
          The submission system is not live yet. When available, owners will be able
          to submit a car, choose how much registration information is public, and
          provide originality details for review.
        </p>
        <a className="button primary" href="mailto:registry@mx5gleneagles.uk">
          Contact the registry
        </a>
      </section>

      <section className="section submitPanel">
        <div className="submitGrid">
          <article>
            <h2>Public by default</h2>
            <p>Registry ID, colour, country, status, partial VIN and approved photos.</p>
          </article>
          <article>
            <h2>Owner controlled</h2>
            <p>Current registration can be full, partial or hidden at owner request.</p>
          </article>
          <article>
            <h2>Private</h2>
            <p>Owner email, phone, full VIN, address and private notes.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
