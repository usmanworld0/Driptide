import type { Product } from '@driptide/contracts';

const outfittersImages: Record<string, string> = {
  outerwear: 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=1200',
  'hoodies-sweats': 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=1200',
  't-shirts-tops': 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200',
  'trousers-denim': 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=1200',
  accessories: 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200',
  polos: 'https://outfitters.com.pk/cdn/shop/files/F1781106204-1.jpg?v=1791445296&width=1200',
  shirts: 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200',
  shorts: 'https://outfitters.com.pk/cdn/shop/files/F0183110903LOWER3.jpg?v=1791445191&width=1200',
  activewear: 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=1200',
  sweaters: 'https://outfitters.com.pk/cdn/shop/files/F0183102901_2.jpg?v=1790570831&width=1200',
  footwear: 'https://outfitters.com.pk/cdn/shop/files/F0393112113_11.jpg?v=1775560116&width=1200',
  fragrances: 'https://outfitters.com.pk/cdn/shop/files/F0102124998_3_copy.jpg?v=1755843658&width=1200',
  sale: 'https://outfitters.com.pk/cdn/shop/files/Men_Web_0cb72726-eac6-417c-a086-d902db00cc28.jpg?v=1792147448&width=1200',
};

const defaultOutfittersImage = outfittersImages['t-shirts-tops'];

export function getReferenceProductImage(product: Product, preferredImage?: string): string {
  const image = preferredImage || product.images.find((entry) => entry.isPrimary)?.url || product.images[0]?.url;
  if (image?.startsWith('https://outfitters.com.pk/cdn/shop/')) return image;
  return outfittersImages[product.category?.slug || ''] || defaultOutfittersImage;
}
