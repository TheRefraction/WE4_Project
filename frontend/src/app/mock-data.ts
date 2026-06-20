import { Ingredient, Extra, Product } from './components/product-card/product-card.component';
import { Menu } from './components/menu-card/menu-card.component';

export const INGREDIENTS: Ingredient[] = [
    { id: 1, name: 'Salade', included: true },
    { id: 2, name: 'Tomate', included: true },
    { id: 3, name: 'Oignon', included: true },
    { id: 4, name: 'Cornichon', included: false },
    { id: 5, name: 'Poivron', included: false },
    { id: 6, name: 'Champignon', included : true}
];

export const EXTRAS: Extra[] = [
    { id: 1, name: 'Petite', price: -2.0, selected: false, type: 'size' },
    { id: 2, name: 'Moyen', price: 0.0, selected: true, type: 'size' },
    { id: 3, name: 'Grande', price: 3.0, selected: false, type: 'size' },
    { id: 4, name: 'Fromage', price: 1.0, selected: false, type: 'supplement' },
    { id: 5, name: 'Double viande', price: 4.0, selected: false, type: 'supplement' },
    { id: 6, name: 'Sauce blanche', price: 1.0, selected: false, type: 'sauce' },
    { id: 7, name: 'Sauce harissa', price: 1.0, selected: false, type: 'sauce' },
    { id: 8, name: 'Sauce algerienne', price: 1.0, selected: false, type: 'sauce' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Kebab Classique',
	description: 'Pain maison, viande grillée, légumes frais et sauce du chef',
	price: 7.50,
	image: '/assets/images/1.png',
    ingredients: [INGREDIENTS[0], INGREDIENTS[1], INGREDIENTS[2], INGREDIENTS[3], INGREDIENTS[4]],
    extras: [EXTRAS[0], EXTRAS[1], EXTRAS[2], EXTRAS[3], EXTRAS[4], EXTRAS[5], EXTRAS[6], EXTRAS[7]],
  },
  {
    id: 2,
    name: 'Burgir classique',
    description : 'Pain maison, steak, salade tomate oignon',
    price : 8.00,
    image : '',
    ingredients: [INGREDIENTS[0], INGREDIENTS[1], INGREDIENTS[2], INGREDIENTS[3]],
    extras: [EXTRAS[0], EXTRAS[3]],
  },
  {
    id: 3,
    name: 'Pizza classique',
    description : 'Base sauce tomate avec viande kebab et champignons',
    price : 7.00,
    image : '',
    ingredients: [INGREDIENTS[1], INGREDIENTS[2], INGREDIENTS[5]],
    extras: [EXTRAS[3], EXTRAS[4]],
  },
  {
    id: 4,
    name: 'Tacos classique',
    description : 'La meilleure brique de Belfort',
    price : 8.50,
    image : '',
    ingredients: [INGREDIENTS[0], INGREDIENTS[1], INGREDIENTS[2]],
    extras: [EXTRAS[3], EXTRAS[4], EXTRAS[5], EXTRAS[6], EXTRAS[7]],
  },
  {
    id: 5,
    name: 'Frites',
    description: 'Une boîte de frites généreuse et croustillante',
    price: 2.50,
    image: '',
    ingredients: [],
    extras: [EXTRAS[5], EXTRAS[6], EXTRAS[7]],
  },
  {
    id: 6,
    name: 'Coca Cherry',
    description: 'Soda rafraîchissant',
    price: 1.00,
    image: '',
    ingredients: [],
    extras: [],
  },
];

export const MENUS : Menu[] = [
    {
        id: 1,
        name: 'Menu Kebab',
        description: 'yummy yummy kebab in my tummy',
        price: 10.00,
        image: '',
        products : [PRODUCTS[0], PRODUCTS[4], PRODUCTS[5]]
    },
    {
        id: 2,
        name: 'Menu Tacos',
        description: 'tacos nacho chimichango',
        price: 9.00,
        image: '',
        products : [PRODUCTS[3], PRODUCTS[4]]
    }
]