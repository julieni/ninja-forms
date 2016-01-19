define( ['views/app/drawer/optionRepeaterError'], function( ErrorView ) {
	var view = Marionette.LayoutView.extend({
		tagName: 'div',
		className: 'nf-table-row',
		template: '#nf-tmpl-edit-setting-option-repeater-default-row',
		id: function() {
			return this.model.cid;
		},

		regions: {
			error: '.nf-option-error'
		},

		initialize: function( data ) {
			this.settingModel = data.settingModel;
			this.dataModel = data.dataModel;
			this.collection = data.collection;
			this.columns = data.columns;
			this.model.on( 'change:errors', this.renderErrors, this );

			if ( 'undefined' != typeof this.settingModel.get( 'tmpl_row' ) ) {
				this.template = '#' + this.settingModel.get( 'tmpl_row' );
			}
		},

		onBeforeDestroy: function() {
			this.model.off( 'change:errors', this.renderErrors );
		},

		onRender: function() {
			/*
			 * Send out a radio message.
			 */
			nfRadio.channel( 'setting-' + this.settingModel.get( 'name' ) + '-option' ).trigger( 'render:setting', this.model, this.dataModel, this );
		},

		onShow: function() {
			if ( this.model.get( 'new' ) ) {
				jQuery( this.el ).find( 'input:first' ).focus();
				this.model.set( 'new', false );
			}
		},

		events: {
			'change .setting': 'changeOption',
			'click .nf-delete': 'deleteOption',
			'keyup': 'keyupOption'
		},

		changeOption: function( e ) {
			nfRadio.channel( 'option-repeater' ).trigger( 'change:option', e, this.model, this.dataModel, this.settingModel );
		},

		deleteOption: function( e ) {
			nfRadio.channel( 'option-repeater' ).trigger( 'click:deleteOption', this.model, this.collection, this.dataModel );
		},

		keyupOption: function( e ) {
			this.maybeAddOption( e );
			nfRadio.channel( 'option-repeater' ).trigger( 'keyup:option', e, this.model, this.dataModel, this.settingModel )
		},

		maybeAddOption: function( e ) {
			if ( 13 == e.keyCode ) {
				nfRadio.channel( 'option-repeater' ).trigger( 'click:addOption', this.collection, this.dataModel );
			}
		},

		renderErrors: function() {
			/*
			 * We don't want to redraw the entire row, which would remove focus from the eq textarea,
			 * so we add and remove error classes manually.
			 */
			if ( ! this.model.get( 'errors' ) ) {
				this.error.empty();
				jQuery( this.el ).removeClass( 'nf-error' );
			} else {
				this.error.show( new ErrorView( { model: this.model } ) );
				jQuery( this.el ).addClass( 'nf-error' );
			}
		},

		templateHelpers: function() {
			var that = this;
			return {
				getColumns: function() {
					return that.columns;
				}
			}
		}

	});

	return view;
} );