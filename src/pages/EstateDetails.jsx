// src/pages/EstateDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../supabase';

const EstateDetails = () => {
  const { id } = useParams();
  const [estate, setEstate] = useState(null);

  useEffect(() => {
    const fetchEstate = async () => {
      let { data, error } = await supabase
        .from('estates')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.log('Error fetching estate:', error);
      else setEstate(data);
    };

    fetchEstate();
  }, [id]);

  return (
    <div>
      {estate ? (
        <>
          <img src={estate.primary_image} alt={estate.address} />
          <h2>{estate.address}</h2>
          {/* Flere detaljer om boligen */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EstateDetails;
