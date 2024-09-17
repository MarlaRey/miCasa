// api/estateApi.js
import supabase from '../../../supabase'; 

export const fetchEstateDetails = async (id) => {
  try {
    const { data, error } = await supabase
      .from('estates')
      .select(`
       *
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      primary_image: data.estate_image_rel.find(rel => rel.is_primary)?.images.image_url || 'src/assets/img/slideshow/slide-5.jpg'
    };
  } catch (error) {
    console.error('Error fetching estate details:', error);
    throw error;
  }
};

export const fetchImages = async (id) => {
  try {
    const { data, error } = await supabase
      .from('estate_image_rel')
      .select('images(image_url)')
      .eq('estate_id', id);

    if (error) throw error;

    return data.map(rel => rel.images.image_url);
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const registerClick = async (id) => {
  try {
    const { error } = await supabase
      .from('estates')
      .update({ clicks: supabase.raw('clicks + 1') })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error registering click:', error);
    throw error;
  }
};
