import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './EstateDetail.module.scss';
// Importerer nødvendige billeder og komponenter
import imgVec from '../assets/img/icons/imgVec.png';
import floorVec from '../assets/img/icons/floorVec.png';
import locationVec from '../assets/img/icons/locationVec.png';
import LikeButton from '../components/LikeButton/LikeButton';
import ImageModal from '../components/ImageModal/ImageModal';

// Definerer EstateDetails komponenten
const EstateDetails = () => {
  const { id } = useParams(); // Henter 'id' parameteren fra URL
  const [estate, setEstate] = useState(null); // Tilstand for ejendom
  const [loading, setLoading] = useState(true); // Tilstand for loading status
  const [error, setError] = useState(null); // Tilstand for eventuelle fejl
  const [isModalOpen, setIsModalOpen] = useState(false); // Tilstand for modal vindue
  const [galleryImages, setGalleryImages] = useState([]); // Tilstand for galleri billeder

  // Funktion til at beregne antallet af dage ejendommen har været på markedet
  const calculateDaysOnMarket = (createdAt) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff = currentDate - createdDate; // Beregner tidsforskellen
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Konverterer til dage
    return daysDiff;
  };

 // useEffect hook til at hente ejendommens data, når komponenten renderes. ja hvorfor bruger jeg ikke mit useFetchEstates.js her, kan man spørge. Og det spørger jeg også mig selv om. Der skal hentes flere data. Det her virker.
 useEffect(() => {
  const fetchEstate = async () => {
    try {
      setLoading(true); // Sætter loading til true før data hentes
      let { data, error } = await supabase
        .from('estates') // Henter data fra 'estates' tabellen
        .select(`
          *,
          estate_types ( name ),
          estate_image_rel ( id, image_id, is_primary, images ( image_url ) ),
          energy_labels ( letter, color ),
          cities ( name, zipcode ),
          employees ( id, firstname, lastname, position, image_url, phone, email )
        `)
        .eq('id', id) // Filtrerer efter den specifikke ejendom
        .single(); // Henter én post

      if (error) throw error; // fejl hvis der opstår en

      // Finder det primære billede for ejendommen eller viser et default
      const primaryImage = data.estate_image_rel?.find(img => img.is_primary)?.images?.image_url || 'src/assets/img/slideshow/slide-5.jpg';

      // Opretter et objekt med ejendommens detaljer
      const estateWithDetails = {
        ...data,
        image_url: primaryImage,
        city: data.cities?.name,
        zipcode: data.cities?.zipcode,
        property_type: data.estate_types?.name,
        days_on_market: calculateDaysOnMarket(data.created_at),
      };

      setEstate(estateWithDetails); // Opdaterer tilstanden med ejendommens data

      // Henter galleri billeder som ikke er primære
      const galleryImages = data.estate_image_rel
        .filter(img => !img.is_primary) // Filtrerer for ikke-primære billeder
        .map(img => img.images.image_url); // Mapper til billed-URL'er
      setGalleryImages(galleryImages); // Opdaterer galleri billeder tilstanden

    } catch (error) {
      setError(error.message); // Sætter fejltilstand ved fejl
    } finally {
      setLoading(false); // Sætter loading til false efter datahentning
    }
  };

  fetchEstate(); // Kalder funktionen for at hente ejendommens data
}, [id]); // Kører igen, når 'id' ændres

// Håndtering af forskellige tilstande
if (loading) return <p>Loading...</p>; // Viser stilfærdig loading besked
if (error) return <p>Error: {error}</p>; // Viser fejlbesked til brugeren
if (!estate) return <p>Fandt ingen bolig, sorry</p>; // Viser besked hvis ingen ejendom findes

// Formaterer prisen med tusindtalsseparator
const formattedPrice = estate.price.toLocaleString('da-DK');

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src={estate.image_url} alt={`Estate in ${estate.address}`} /> {/* Viser ejendommens billede */}
        <div className={styles.raisinBlackBar}></div>
      </div>
      <main className={styles.main}>
        <section className={styles.gridSection}>
          <div className={styles.div1}>
            <h1>{estate.address}</h1>
            <p>{estate.zipcode} {estate.city}</p>
            <p>{estate.property_type} | {estate.floor_space} m² | {estate.num_rooms} vær</p>
            <p>Clicks: {estate.num_clicks}</p>
          </div>

          <div className={styles.div2}>
            <div className={styles.iconWrapper} onClick={() => setIsModalOpen(true)}>
              <img src={imgVec} alt="Image" />
            </div>
            <div className={styles.iconWrapper}>
              <img src={floorVec} alt="Floorplan" />
            </div>
            <div className={styles.iconWrapper}>
              <img src={locationVec} alt="Location" />
            </div>
            <div className={styles.iconWrapper}>
              <div className={styles.heart}>
                <LikeButton estateId={estate.id} />
              </div>
            </div>
          </div>

          <div className={styles.div3}>
            <div>
              <p>Kontantpris: </p><h1>{formattedPrice} DKK</h1>
            </div>
            <p>Udbetaling: {estate.payout} DKK</p>
            <p>Ejerudgift pr. måned: {estate.cost} DKK</p>
          </div>

          <div className={styles.div4}>
            <p>Sagsnummer: {estate.id}</p>
            <p>Boligareal: {estate.floor_space} m²</p>
            <p>Grundareal: {estate.ground_space} m²</p>
            <p>Antal rum: {estate.num_rooms}</p>
            <p>Antal plan: {estate.num_floors}</p>
          </div>

          <div className={styles.div5}>
            <p>Kælderareal: {estate.basement_space} m²</p>
            <p>Byggeår: {estate.year_construction}</p>
            <p>Ombygget: {estate.year_rebuilt}</p>
            <p>Energimærke: {estate.energy_labels?.letter}</p>
            <p>Liggetid: {estate.days_on_market} dage</p>
          </div>

          <div className={styles.div6}>
            <p>Kontantpris: {formattedPrice} DKK</p>
            <p>Udbetaling: {estate.payout} DKK</p>
            <p>Brutto ex. ejerudgift: {estate.gross} DKK</p>
            <p>Netto ex. ejerudgift: {estate.net} DKK</p>
            <p>Ejerudgift: {estate.cost} DKK</p>
          </div>
        </section>

        <section className={styles.descriptionSection}>
          <div className={styles.description}>
            <p>{estate.description}</p>
          </div>
          <div className={styles.employeeInfo}>
            <img src={estate.employees?.image_url || 'fallback_agent_image.jpg'} alt={`${estate.employees?.firstname} ${estate.employees?.lastname}`} />
            <p>{estate.employees?.firstname} {estate.employees?.lastname}</p>
            <p>{estate.employees?.position}</p>
            <p>Phone: {estate.employees?.phone}</p>
            <p>Email: {estate.employees?.email}</p>
          </div>
        </section>
      </main>

      <ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} images={galleryImages} />
    </div>
  );
};

export default EstateDetails;
