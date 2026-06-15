export default function Privacy() {
  return (
    <main>
      <section className="pageHeader">
        <p className="eyebrow">Privacy</p>
        <h1>Cars are public. Owners are private.</h1>
        <p>
          The registry is designed to preserve vehicle history without exposing
          owner contact information or precise locations.
        </p>
      </section>

      <section className="section split">
        <div><h2>What stays private</h2></div>
        <div className="copy">
          <p>
            Owner emails, phone numbers, addresses, full VINs and private notes
            should not be published on car pages.
          </p>
          <p>
            Owner edits go through an approval queue before appearing publicly.
            This protects against false claims, incorrect data and vandalism.
          </p>
        </div>
      </section>
    </main>
  )
}
