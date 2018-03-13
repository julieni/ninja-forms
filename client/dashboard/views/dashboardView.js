/**
 * Dashboard Layout View
 *
 * @package Ninja Forms
 * @subpackage Dashboard
 * @copyright (c) 2017 WP Ninjas
 * @since 3.2
 */
define( [ 'views/sections/widgets.js', 'views/sections/services.js', 'views/sections/apps.js', 'views/sections/memberships.js' ], function( WidgetView, ServicesView, AppsView, MembershipsView ) {
    var view = Marionette.View.extend( {
        template: "#tmpl-nf-dashboard",

        currentView: 'widgets',

        regions: {
            content: '.content'
        },

        events: {
            'click .widgets a': function(e){
                this.showChildView( 'content', new WidgetView() );
                jQuery( '.' + this.currentView).find( 'a' ).removeClass( 'active' );
                e.target.classList.add( 'active' );
                this.currentView = 'widgets';
            },
            'click .services a': function(e){
                this.showChildView( 'content', new ServicesView() );
                jQuery( '.' + this.currentView).find( 'a' ).removeClass( 'active' );
                e.target.classList.add( 'active' );
                this.currentView = 'services';
            },
            'click .apps a': function(e){
                this.showChildView( 'content', new AppsView() );
                jQuery( '.' + this.currentView).find( 'a' ).removeClass( 'active' );
                e.target.classList.add( 'active' );
                this.currentView = 'apps';
            },
            'click .memberships a': function(e){
                this.showChildView( 'content', new MembershipsView() );
                jQuery( '.' + this.currentView).find( 'a' ).removeClass( 'active' );
                e.target.classList.add( 'active' );
                this.currentView = 'memberships';
            },
        },

        initialize: function() {
            switch( window.location.hash ) {
                case '#apps':
                    this.currentView = 'apps';
                    break;
                case '#services':
                    this.currentView = 'services';
                    break;
                case '#memberships':
                    this.currentView = 'memberships';
                    break;
                case '#widgets':
                default:
                    this.currentView = 'widgets';
            }

            /**
             * Radio Routers
             * TODO: Clean this up.
             */
            nfRadio.channel( 'dashboard' ).reply( 'show:widgets', function(){
                this.showChildView('content', new WidgetView() );
                jQuery( 'nav.sections a.active' ).removeClass( 'active' );
                jQuery( 'nav.sections .widgets a' ).addClass( 'active' );
                this.currentView = 'widgets';
            }, this );
            nfRadio.channel( 'dashboard' ).reply( 'show:services', function(){
                this.showChildView('content', new ServicesView() );
                jQuery( 'nav.sections a.active' ).removeClass( 'active' );
                jQuery( 'nav.sections .services a' ).addClass( 'active' );
                this.currentView = 'services';
            }, this );
            nfRadio.channel( 'dashboard' ).reply( 'show:apps', function(){
                this.showChildView('content', new AppsView() );
                jQuery( 'nav.sections a.active' ).removeClass( 'active' );
                jQuery( 'nav.sections .apps a' ).addClass( 'active' );
                this.currentView = 'apps';
            }, this );
        },

        onRender: function() {
            switch( window.location.hash ) {
                case '#apps':
                    var childView = new AppsView();
                    break;
                case '#memberships':
                    var childView = new MembershipsView();
                    break;
                case '#services':
                    var childView = new ServicesView();
                    break;
                case '#widgets':
                default:
                    var childView = new WidgetView();
            }
            this.showChildView('content', childView );
        },

        templateContext: function() {
            var that = this;
            return {
                renderNav: function() {
                    var content = document.createElement( 'div' );
                    _.each( nfDashItems, function(section) {
                        var item = document.createElement( 'li' );
                        var link = document.createElement( 'a' );
                        link.href = '#' + section.slug;
                        if ( that.currentView == section.slug ) link.classList.add( 'active' );
                        link.innerHTML = section.niceName;
                        item.classList.add( section.slug );
                        item.appendChild( link );
                        content.appendChild( item );
                    } );
                    return content.innerHTML;
                },
            }
        }
    } );
    return view;
} );
