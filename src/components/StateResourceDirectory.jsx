import { useMemo, useState } from 'react';
import './StateResourceDirectory.css';

const stateResources = [["Alabama","Alabama Coalition Against Domestic Violence","https://acadv.org/"],["Alaska","Alaska Network on Domestic Violence and Sexual Assault","https://andvsa.org/"],["Arizona","Arizona Coalition to End Sexual and Domestic Violence","https://www.acesdv.org/"],["Arkansas","Arkansas Coalition Against Domestic Violence","https://www.domesticpeace.com/"],["California","California Partnership to End Domestic Violence","https://www.cpedv.org/"],["Colorado","Violence Free Colorado","https://violencefreecolorado.org/"],["Connecticut","Connecticut Coalition Against Domestic Violence","https://www.ctcadv.org/"],["Delaware","Delaware Coalition Against Domestic Violence","https://dcadv.org/"],["District of Columbia","DC Coalition Against Domestic Violence","https://dccadv.org/"],["Florida","Florida Partnership to End Domestic Violence","https://www.fpedv.org/"],["Georgia","Georgia Coalition Against Domestic Violence","https://gcadv.org/"],["Hawaii","Hawaii State Coalition Against Domestic Violence","https://hscadv.org/"],["Idaho","Idaho Coalition Against Sexual & Domestic Violence","https://idahocoalition.org/"],["Illinois","Illinois Coalition Against Domestic Violence","https://ilcadv.org/"],["Indiana","Indiana Coalition Against Domestic Violence","https://icadvinc.org/"],["Iowa","Iowa Coalition Against Domestic Violence","https://icadv.org/"],["Kansas","Kansas Coalition Against Sexual & Domestic Violence","https://www.kcsdv.org/"],["Kentucky","ZeroV (Kentucky domestic violence coalition)","https://zerov.org/"],["Louisiana","Louisiana Coalition Against Domestic Violence","https://lcadv.org/"],["Maine","Maine Coalition to End Domestic Violence","https://www.mcedv.org/"],["Maryland","Maryland Network Against Domestic Violence","https://mnadv.org/"],["Massachusetts","Jane Doe Inc.","https://janedoe.org/"],["Michigan","Michigan Coalition to End Domestic & Sexual Violence","https://mcedsv.org/"],["Minnesota","Violence Free Minnesota","https://www.vfmn.org/"],["Mississippi","Mississippi Coalition Against Domestic Violence","https://mcadv.org/"],["Missouri","Missouri Coalition Against Domestic and Sexual Violence","https://mocadsv.org/"],["Montana","Montana Coalition Against Domestic & Sexual Violence","https://mcadsv.com/"],["Nebraska","Nebraska Coalition to End Sexual and Domestic Violence","https://www.nebraskacoalition.org/"],["Nevada","Nevada Coalition to End Domestic and Sexual Violence","https://www.ncedsv.org/"],["New Hampshire","New Hampshire Coalition Against Domestic and Sexual Violence","https://www.nhcadsv.org/"],["New Jersey","New Jersey Coalition to End Domestic Violence","https://www.njcedv.org/"],["New Mexico","New Mexico Coalition Against Domestic Violence","https://nmcadv.org/"],["New York","New York State Coalition Against Domestic Violence","https://www.nyscadv.org/"],["North Carolina","North Carolina Coalition Against Domestic Violence","https://nccadv.org/"],["North Dakota","North Dakota Domestic & Sexual Violence Coalition","https://nddsvc.org/"],["Ohio","Ohio Domestic Violence Network","https://www.odvn.org/"],["Oklahoma","Oklahoma Office of the Attorney General – Victim Services","https://www.oag.ok.gov/victim-services"],["Oregon","Oregon Coalition Against Domestic & Sexual Violence","https://www.ocadsv.org/"],["Pennsylvania","Pennsylvania Coalition Against Domestic Violence","https://www.pcadv.org/"],["Rhode Island","Rhode Island Coalition Against Domestic Violence","https://www.ricadv.org/"],["South Carolina","South Carolina Coalition Against Domestic Violence and Sexual Assault","https://www.sccadvasa.org/"],["South Dakota","South Dakota Network Against Family Violence and Sexual Assault","https://sdnafvsa.com/"],["Tennessee","Tennessee Coalition to End Domestic & Sexual Violence","https://tncoalition.org/"],["Texas","Texas Council on Family Violence","https://tcfv.org/"],["Utah","Utah Domestic Violence Coalition","https://udvc.org/"],["Vermont","Vermont Network Against Domestic and Sexual Violence","https://vtnetwork.org/"],["Virginia","Virginia Sexual & Domestic Violence Action Alliance","https://vsdvalliance.org/"],["Washington","Washington State Coalition Against Domestic Violence","https://wscadv.org/"],["West Virginia","West Virginia Coalition Against Domestic Violence","https://wvcadv.org/"],["Wisconsin","End Domestic Abuse Wisconsin","https://endabusewi.org/"],["Wyoming","Wyoming Coalition Against Domestic Violence and Sexual Assault","https://wyomingdvsa.org/"]];

export default function StateResourceDirectory() {
  const [selectedState, setSelectedState] = useState('');
  const [search, setSearch] = useState('');

  const visibleResources = useMemo(() => {
    const term = search.trim().toLowerCase();
    return stateResources.filter(([state, organization]) => {
      const matchesState = !selectedState || state === selectedState;
      const matchesSearch = !term || state.toLowerCase().includes(term) || organization.toLowerCase().includes(term);
      return matchesState && matchesSearch;
    });
  }, [selectedState, search]);

  return (
    <section className="state-resource-directory" aria-labelledby="state-resource-title">
      <div className="state-resource-heading">
        <p className="state-resource-kicker">SUPPORT • OPTIONS • CONNECTION</p>
        <h2 id="state-resource-title">U.S. Domestic Violence Resource Directory</h2>
        <p>Find the recognized domestic violence coalition or victim-services resource for your state.</p>
      </div>

      <div className="state-resource-alert" role="note">
        <strong>If you are in immediate danger, call 911 if it is safe.</strong>
        <p>National Domestic Violence Hotline: <a href="tel:18007997233">1-800-799-SAFE (7233)</a> · Text <strong>START</strong> to <a href="sms:88788">88788</a> · <a href="https://www.thehotline.org/" target="_blank" rel="noreferrer">Online support</a>.</p>
        <p>Contacting an organization may leave traces on a shared or monitored device. Use a safer device if needed.</p>
      </div>

      <div className="state-resource-filters">
        <label htmlFor="resource-state">Choose a state</label>
        <select id="resource-state" value={selectedState} onChange={(event) => setSelectedState(event.target.value)}>
          <option value="">All states and D.C.</option>
          {stateResources.map(([state]) => <option key={state} value={state}>{state}</option>)}
        </select>
        <label htmlFor="resource-search">Search by state or organization</label>
        <input id="resource-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search resources..." />
      </div>

      <p className="state-resource-count" aria-live="polite">Showing {visibleResources.length} of {stateResources.length} state and district listings</p>
      <div className="state-resource-list">
        {visibleResources.map(([state, organization]) => (
          <article className="state-resource-card" key={state}>
            <div><h3>{state}</h3><p>{organization}</p></div>
            <a href={stateResources.find((item) => item[0] === state)[2]} target="_blank" rel="noreferrer" aria-label={`Visit ${organization} website`}>Visit website ↗</a>
          </article>
        ))}
        {visibleResources.length === 0 && <p>No matching listing. Try another state or search term.</p>}
      </div>

      <div className="state-resource-sources">
        <strong>Directory sources:</strong>
        <a href="https://www.justice.gov/ovw/state-and-territory-coalitions" target="_blank" rel="noreferrer">U.S. Department of Justice – State and Territory Coalitions</a>
        <a href="https://nnedv.org/content/state-u-s-territory-coalitions/" target="_blank" rel="noreferrer">NNEDV – State and U.S. Territory Coalitions</a>
        <p>Coalition websites help connect people with local programs; they are not all direct crisis hotlines. Listings can change, so verify contact details on the linked organization’s official site. Oklahoma’s listing links to the state Attorney General’s victim-services resource.</p>
      </div>
    </section>
  );
}
