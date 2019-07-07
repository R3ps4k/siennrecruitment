import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Product } from '@root/app/shared/models/product.model';
import { Page } from '@root/app/shared/constants/pages.constant';
import { NavigationService } from '@root/app/shared/services';
import { ProductService } from '@root/app/modules/products/services';
import { ProductFormType } from '@root/app/shared/constants/product-form.constant';

@Component({
  selector: 'my-product-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @ViewChild('nameInput') public nameInput: ElementRef;
  @Input() public type: ProductFormType;
  @Input() public set product(product: Product) {
    this._product = product;

    if (product) {
      this.rebuildForm();
    }
  }

  @Output() public formSubmit: EventEmitter<Product> = new EventEmitter<
    Product
  >();

  public _product: Product;
  public productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private navigationService: NavigationService
  ) {}

  public get isEditForm(): boolean {
    return this.type === ProductFormType.EDIT;
  }

  public get submitButtonText(): string {
    return this.isEditForm ? 'Save' : 'Add';
  }

  public get submitButtonIcon(): string {
    return this.isEditForm ? 'save' : 'add_circle';
  }

  /// get date depending on checkBox state
  private get expirationDate(): Date {
    return this.productForm.get('expDateCheckbox').value
      ? this.productForm.get('expirationDate').value
      : new Date('0001-01-01');
  }

  public get preparedProduct(): Product {
    return {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      expirationDate: this.expirationDate
    };
  }

  public get preparedModifiedProduct(): Product {
    return {
      ...this.preparedProduct,
      productID: this._product.productID
    };
  }

  public ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      description: [''],
      name: ['', Validators.required],
      price: [0, Validators.required],
      expDateCheckbox: [false],
      expirationDate: [{ value: '', disabled: true }, this.futureDateValidator()]
    });
    this._product = {
      productID: '',
      name: '',
      description: '',
      expirationDate: null,
      price: 0
    };

    this.productForm
      .get('expDateCheckbox')
      .statusChanges.subscribe(_ => this.toggleExpDate());

  }

  /// enable/disable expirationDate field depending on checkBox state
  toggleExpDate() {
    const expDate = this.productForm.get('expirationDate');
    this.productForm.get('expDateCheckbox').value ? expDate.enable() : expDate.disable();
  }

   /// expiration date validator function
   futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = new Date(control.value) < new Date();
      return forbidden ? {'futureDateValidator': {value: control.value}} : null;
    };
  }

  public onSubmitClick(): void {
    this.formSubmit.emit(
      this.isEditForm ? this.preparedModifiedProduct : this.preparedProduct
    );
  }

  public onResetClick(): void {
    this.rebuildForm();
    this.nameInput.nativeElement.focus();
  }

  public onBackClick(): void {
    this.navigationService.redirect(Page.PRODUCTS);
  }

  public onEnterClick(event: KeyboardEvent) {
    event.preventDefault();
    // TODO: handle focusing on the next input
  }

  private rebuildForm(): void {
    this.productForm.reset({
      name: this._product.name,
      description: this._product.description,
      expirationDate: this._product.expirationDate,
      price: this._product.price
    });

   /// set checkBox value('true') if expiration date had been arleady set
   if (new Date(this.productForm.get('expirationDate').value) > new Date('0001-01-01') ) {
      this.productForm.get('expDateCheckbox').setValue('true');
    } else {
      this.productForm.get('expirationDate').setValue(null);
    }
  }
}
