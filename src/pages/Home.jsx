import React, { useState, useEffect, useCallback, useContext } from 'react'; 
import supabase from '../../supabase'; 
import styles from './Home.module.scss';
import SliderGallery from '../components/Home_SliderGallery/SliderGallery'; // Importerer billedslider
import EstateSection from '../components/Home_EstateSection/EstateSection'; // Importerer ejendomsektion
import FormModal from '../components/FormModal/FormModal'; // Importerer formularmodal
import { AuthContext } from '../providers/AuthContext'; 
import ReviewSection from '../components/Home_ReviewSection/ReviewSection'; // Importerer anmeldelsessektion
import EmployeeSection from '../components/Home_EmployeeSection/EmployeeSection'; // Importerer medarbejdersektion

const Home = () => {
  const { user } = useContext(AuthContext); // Henter brugeroplysninger fra AuthContext
  const [isVisible, setIsVisible] = useState(false); // Tilstand for synlighed af komponenten, fordi jeg har lavet lidt blød fade in til at loade home med
  const [isFormVisible, setIsFormVisible] = useState(false); // Tilstand for synlighed af anmeldelsesformularen
  const [reviewData, setReviewData] = useState({ // Tilstand for anmeldelsesdata
    title: '',
    content: '',
    num_stars: '',
    estate_id: ''
  });

  // useEffect hook til at sætte synlighed til true, når komponenten indlæses
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Callback funktion til at håndtere anmeldelsesindsendelse
  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault(); // Forhindrer standard formularindsendelse
    if (!user) {
      alert('Du skal være logget ind for at skrive en anmeldelse.'); // Tjekker om brugeren er logget ind
      return;
    }

    // Indsætter anmeldelsen i databasen
    const { error } = await supabase
      .from('reviews')
      .insert([{
        user_id: user.id,
        estate_id: reviewData.estate_id, 
        title: reviewData.title, 
        content: reviewData.content, 
        num_stars: reviewData.num_stars, 
        created_at: new Date().toISOString(), 
        is_active: true 
      }]);

    // Håndterer fejl ved indsendelse
    if (error) {
      console.error('Error submitting review:', error);
      alert('Der opstod en fejl ved indsendelse af anmeldelsen.'); // Viser fejlbesked
    } else {
      // Nulstiller anmeldelsesdata og lukker formularen
      setReviewData({ title: '', content: '', num_stars: '', estate_id: '' });
      setIsFormVisible(false);
    }
  }, [user, reviewData]); // Kører når 'user' eller 'reviewData' ændres

  return (
    <div className={`${styles.home} ${isVisible ? styles.homeVisible : ''}`}> {/* Dynamisk klassetildeling */}
      <section className={styles.gallerySection}>
        <SliderGallery /> 
      </section>

      <EstateSection isHome={true} />

      <ReviewSection /> 

      <EmployeeSection /> 

      {user && ( // Viser formularen hvis brugeren er logget ind
        <FormModal
          isVisible={isFormVisible} // Sender synlighed for formularen
          onClose={() => setIsFormVisible(false)} // Håndterer lukning af formular
          onSubmit={handleReviewSubmit} // Sender anmeldelsesindsendelsesfunktion
          reviewData={reviewData} // Sender anmeldelsesdata
          setReviewData={setReviewData} // Sender funktion til at opdatere anmeldelsesdata
        />
      )}
    </div>
  );
};

export default Home;
