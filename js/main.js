angular.module( 'angular-drum-style-datepicker', [] )
.controller( 'MainController', function( $scope ) {
    $scope.time = {
        days: 2,
        hours: 15,
        minutes: 30
    }
})
.directive( 'drumStyleDatepicker', function( $timeout ) {
    return {
        template: ['<div class="date-time-picker">',
                        '<div class="result">',
                            '<div class="result-col">',
                                '{{ field.days }}<span class="picker-label-result">д</span>',
                           '</div>',
                            '<div class="result-col">',
                                '{{ field.hours }}<span class="picker-label-result">ч</span>',
                            '</div>',
                            '<div class="result-col">',
                                '{{ field.minutes }}<span class="picker-label-result">м</span>',
                            '</div>',
                        '</div>',
                        '<div class="hidden-block">',
                            '<div class="current-line-border-top"></div>',
                            '<div class="current-line-border-bottom"></div>',
                            '<div class="col">',
                                '<div class="picker-label">д</div>',
                                '<select ng-model="field.days" name="days" label="дни">',
                                    '<option ng-repeat="i in list.days" value="{{ i }}">{{ i }}</option>',
                                '</select>',
                            '</div>',
                            '<div class="col">',
                                '<div class="picker-label">ч</div>',
                                '<select ng-model="field.hours" name="hours" label="часы">',
                                    '<option ng-repeat="i in list.hours" value="{{ i }}">{{ i }}</option>',
                                '</select>',
                            '</div>',
                            '<div class="col">',
                                '<div class="picker-label">м</div>',
                                '<select ng-model="field.minutes" name="minutes" label="минуты">',
                                    '<option ng-repeat="i in list.minutes" value="{{ i }}">{{ i }}</option>',
                                '</select>',
                            '</div>',
                        '</div>',
                    '</div>' ].join( '' ),
        restrict: 'E',
        scope: {
            field: '=',
        },
        compile: function( $scope, $element, $attrs ) { 
            return {
                pre: function( $scope, $element, $attrs ) { 
                    var firstNullControl = function( number ) {
                        return ( number < 10 ) ? '0' + number : '' + number;
                    };

                    var range = function( count ) {
                        return Array
                                .apply( null, Array( count ) )
                                .map( function (_, i) { return i; } );
                    };

                    $scope.list = {
                        days:    range( 30 ).map( firstNullControl ),
                        hours:   range( 24 ).map( firstNullControl ),
                        minutes: range( 60 ).map( firstNullControl )
                    };
                    
                    $scope.field = {
                        days :      ( $scope.field ) ? $scope.list.days[ +$scope.field.days ]       : $scope.list.days[ 0 ],
                        hours :     ( $scope.field ) ? $scope.list.hours[ +$scope.field.hours ]     : $scope.list.hours[ 0 ],
                        minutes :   ( $scope.field ) ? $scope.list.minutes[ +$scope.field.minutes ] : $scope.list.minutes[ 0 ]
                    }
                },
                post: function( $scope, $element, $attrs ) {
                    // widget init
                    $timeout( function() {
                        $element.find( 'select' ).drum({
                            onChange: function( select ) {
                                $scope.$apply( function() {
                                    $scope.field[ select.name ] = select.selectedOptions[0].value;
                                });
                            }
                        });
                        $element.find( '.hidden-block' ).hide();
                    }, 1 );

                    // check click outside element
                    $element.find( '.result' ).on( 'click', function( e ) {
                        $( this ).siblings( '.hidden-block' ).show();
                        var self = this;

                        $( document ).on( 'mousedown', function( event ) {
                            if ( $( event.target ).parents( '.date-time-picker' ).is( $( self ).parents( ".date-time-picker" ) ) )
                                return;
                            $( self ).siblings( ".hidden-block" ).hide();
                            event.stopPropagation();
                        });
                    });
                }
            }
        }
    }
});