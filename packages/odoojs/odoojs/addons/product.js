import mail from './mail'
import uom from './uom'

const product_product_extend = (BaseClass)=>{
    class cls extends BaseClass {
        get_history_price( company_id, date=null) {
            const data = this.call( 'get_history_price', [company_id, date] )
            return data;
        }
    }

    return cls
}


export default  {
    name: 'product',
    depends: {mail,uom},
    models: {
        'res.partner': {
            fields: ['property_product_pricelist'],
        },

        'product.template': {
            fields: [
                'name', 'sequence',
                'description','description_purchase','description_sale',
                'type','rental','categ_id','currency_id',
                'price','list_price','lst_price','standard_price',
                'volume','weight','weight_uom_id','weight_uom_name',
                'sale_ok','purchase_ok','pricelist_id',
                'uom_id','uom_name','uom_po_id','company_id',
                'packaging_ids','seller_ids','variant_seller_ids',
                'active','color','is_product_variant',
                'attribute_line_ids','product_variant_ids',
                'product_variant_id','product_variant_count',
                'barcode','default_code','item_ids',
                'image','image_medium','image_small'
            ],
        },

        'product.category': {
            fields: [
                'name','complete_name',
                'parent_id','parent_path','child_id','product_count'
            ],
        },

        'product.price.history': {
            fields: [
                'company_id','product_id','datetime','cost'
            ],
        },

        'product.product': {
            fields: [
                'price','price_extra','lst_price',
                'default_code','code','partner_ref',
                'active','product_tmpl_id','barcode',
                'attribute_value_ids','product_template_attribute_value_ids',
                'image_variant','image','image_small','image_medium',
                'is_product_variant','standard_price',
                'volume','weight',
                'pricelist_item_ids','packaging_ids'
            ],

            extend: product_product_extend
        },

        'product.packaging': {
            fields: [
                'name','sequence','product_id','qty',
                'barcode','product_uom_id'
            ],
        },

        'product.supplierinfo': {
            fields: [
                'name','product_name','product_code','sequence',
                'product_uom','min_qty','price','company_id',
                'currency_id','date_start','date_end',
                'product_id','product_tmpl_id','product_variant_count','delay'
            ],
        },

        'product.pricelist': {
            fields: [
                'name','active','item_ids','currency_id',
                'company_id','sequence', 'country_group_ids'
            ],
        },

        'res.country.group': {
            fields: [
                'pricelist_ids'
            ],
        },

        'product.pricelist.item': {
            fields: [
                'product_tmpl_id','product_id','categ_id',
                'min_quantity','applied_on','base',
                'base_pricelist_id','pricelist_id','price_surcharge',
                'price_discount','price_round',
                'price_min_margin','price_max_margin',
                'company_id','currency_id','date_start','date_end',
                'compute_price','fixed_price','percent_price','name','price'
            ],
        },

        'product.attribute': {
            fields: [
                'name','value_ids','sequence','attribute_line_ids',
                'create_variant'
            ],
        },

        'product.attribute.value': {
            fields: [
                'name','sequence','attribute_id'
            ],
        },

        'product.template.attribute.line': {
            fields: [
                'product_tmpl_id','attribute_id','value_ids',
                'product_template_value_ids'
            ],
        },

        'product.template.attribute.value': {
            fields: [
                'name','product_attribute_value_id','product_tmpl_id',
                'attribute_id','sequence','price_extra','exclude_for'
            ],
        },

        'product.template.attribute.line': {
            fields: [
                'product_template_attribute_value_id',
                'product_tmpl_id',
                'value_ids'
            ],
        },

    }
}

