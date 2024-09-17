// src/pages/EstateDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './EstateDetail.module.scss';

const EstateDetails = () => {
  const { id } = useParams();
  const [estate, setEstate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstate = async () => {
      try {
        setLoading(true);
        let { data, error } = await supabase
          .from('estates')
          .select(`
            *,
            estate_image_rel ( images ( image_url ) ),
            cities ( name ),
            employees ( id, firstname, lastname, position, image_url, phone, email )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        const primaryImage = data.estate_image_rel?.[0]?.images?.image_url || 'src/assets/img/slideshow/slide-5.jpg';

        const estateWithImage = {
          ...data,
          image_url: primaryImage,
          city: data.cities?.name,
        };

        setEstate(estateWithImage);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEstate();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!estate) return <p>No estate found</p>;

  return (
    <div className={styles.container}>
      {/* Primært billede */}
      <div className={styles.imageSection}>
        <img src={estate.image_url} alt={`Estate in ${estate.address}`} />
        <div className={styles.raisinBlackBar}></div>
      </div>
      <main className={styles.main}>
      {/* Sektion 1 */}
      <section className={styles.gridSection}>
        {/* Div 1 - Adresse, by, postnummer */}
        <div className={styles.div1}>
          <h1>{estate.address}</h1>
          <p>{estate.city} | {estate.postal_code}</p>
          <p>{estate.property_type} | {estate.floor_space} m² | {estate.num_rooms} vær</p>
          <p>Clicks: {estate.num_clicks}</p>
        </div>

        {/* Div 2 - Ikoner */}
        <div className={styles.div2}>
          <img src="src/assets/img/icons/img.png" alt="Image" />
          <img src="/assets/icons/floor.png" alt="Floorplan" />
          <img src="/assets/icons/location.png" alt="Location" />
          <img src="/assets/icons/heart_empty.png" alt="Favorite" />
        </div>

        {/* Div 3 - Prisoplysninger */}
        <div className={styles.div3}>
        <p>Kontantpris:</p><h1>{estate.price} DKK</h1>
          <p>Udbetaling: {estate.down_payment} DKK</p>
          <p>Ejerudgift pr. måned: {estate.owner_expense_monthly} DKK</p>
        </div>

        {/* Div 4 - Boligdetaljer */}
        <div className={styles.div4}>
          <p>Sagsnummer: {estate.id}</p>
          <p>Boligareal: {estate.floor_space} m²</p>
          <p>Grundareal: {estate.ground_space} m²</p>
          <p>Antal rum: {estate.num_rooms}</p>
          <p>Antal plan: {estate.num_floors}</p>
        </div>

        {/* Div 5 - Andre detaljer */}
        <div className={styles.div5}>
          <p>Kælderareal: {estate.basement_space} m²</p>
          <p>Byggeår: {estate.year_construction}</p>
          <p>Ombygget: {estate.year_rebuilt}</p>
          <p>Energimærke: {estate.energy_label_id}</p>
          <p>Liggetid: {estate.days_on_market} dage</p>
        </div>

        {/* Div 6 - Økonomi */}
        <div className={styles.div6}>
          <p>Kontantpris: {estate.price} DKK</p>
          <p>Udbetaling: {estate.down_payment} DKK</p>
          <p>Brutto ex. ejerudgift: {estate.brutto} DKK</p>
          <p>Netto ex. ejerudgift: {estate.net} DKK</p>
          <p>Ejerudgift: {estate.owner_expense_monthly} DKK</p>
        </div>
      </section>

      {/* Sektion 2 */}
      <section className={styles.descriptionSection}>
        <div className={styles.description}>
          <p>{estate.description}</p>
        </div>
        <div className={styles.employeeInfo}>
          <img src={estate.employees?.image_url || 'fallback_agent_image.jpg'} alt={`${estate.employees?.firstname} ${estate.employees?.lastname}`} />
          <p>{estate.employees?.firstname} {estate.employees?.lastname}</p>
          <p>Position: {estate.employees?.position}</p>
          <p>Phone: {estate.employees?.phone}</p>
          <p>Email: {estate.employees?.email}</p>
        </div>
      </section>
      </main>
    </div>
  );
};

export default EstateDetails;
    