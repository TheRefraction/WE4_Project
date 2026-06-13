import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Ingredient {
	id: number;
	name: string;
	included: boolean;
}

interface Extra {
	id: number;
	name: string;
	price: number;
	selected: boolean;
	type: 'supplement' | 'size' | 'sauce';
}

export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image: string;
	ingredients: Ingredient[];
	extras: Extra[];
}

@Component({
	selector: 'app-product-card',
	standalone: true,
	templateUrl: './product-card.component.html',
	styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
	@Input() product: Product = {
		id: 1,
		name: 'Kebab Classique',
		description: 'Pain maison, viande grillée, légumes frais et sauce du chef',
		price: 7.50,
		image: '/assets/images/1.png',
		ingredients: [
			{ id: 1, name: 'Salade', included: true },
			{ id: 2, name: 'Tomate', included: true },
			{ id: 3, name: 'Oignon', included: true },
			{ id: 4, name: 'Cornichon', included: false },
			{ id: 6, name: 'Poivron', included: false },
		],
		extras: [
			{ id: 1, name: 'Petite', price: -2.0, selected: false, type: 'size' },
			{ id: 2, name: 'Moyen', price: 0.0, selected: true, type: 'size' },
			{ id: 3, name: 'Grande', price: 3.0, selected: false, type: 'size' },
			{ id: 4, name: 'Fromage', price: 1.0, selected: false, type: 'supplement' },
			{ id: 5, name: 'Double viande', price: 4.0, selected: false, type: 'supplement' },
			{ id: 6, name: 'Sauce blanche', price: 1.0, selected: false, type: 'sauce' },
			{ id: 7, name: 'Sauce harissa', price: 1.0, selected: false, type: 'sauce' },
			{ id: 8, name: 'Sauce algerienne', price: 1.0, selected: false, type: 'sauce' },
		]
	}

	expanded = signal(false);

	ingredients = signal<Ingredient[]>([]);
	extras = signal<Extra[]>([]);

	ngOnInit() {
		this.ingredients.set([...this.product.ingredients]);
		this.extras.set([...this.product.extras]);
	}

	totalPrice = computed(() => {
		const extrasTotal = this.extras()
			.filter(e => e.selected)
			.reduce((sum, e) => sum + e.price, 0)

		return (this.product.price + extrasTotal).toFixed(2);
	});

	get sizes() { return this.extras().filter(e => e.type === 'size'); }
	get supplements() { return this.extras().filter(e => e.type === 'supplement'); }
	get sauces() { return this.extras().filter(e => e.type === 'sauce'); }

	toggleIngredient(id: number) {
		this.ingredients.update(list =>
			list.map(i => i.id === id ? { ...i, included: !i.included } : i)
		);
	}

	toggleSize(id: number) {
		this.extras.update(list =>
			list.map(e => e.type === 'size' ? { ...e, selected: e.id === id } : e)
		);
	}

	toggleExtra(id: number) {
		this.extras.update(list =>
			list.map(e => e.id === id ? { ...e, selected: !e.selected } : e)
		);
	}

	fallbackImage(event: Event) {
		(event.target as HTMLImageElement).src = '/assets/images/1.png';
	}
};
