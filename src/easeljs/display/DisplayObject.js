/*
* DisplayObject
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * The EaselJS Javascript library provides a retained graphics mode for canvas including a full hierarchical display
 * list, a core interaction model, and helper classes to make working with 2D graphics in Canvas much easier.
 * EaselJS provides straight forward solutions for working with rich graphics and interactivity with HTML5 Canvas...
 *
 * <h4>Getting Started</h4>
 * To get started with Easel, create a {{#crossLink "Stage"}}{{/crossLink}} that wraps a CANVAS element, and add
 * {{#crossLink "DisplayObject"}}{{/crossLink}} instances as children. EaselJS supports:
 * <ul>
 *      <li>Images using {{#crossLink "Bitmap"}}{{/crossLink}}</li>
 *      <li>Vector graphics using {{#crossLink "Shape"}}{{/crossLink}} and {{#crossLink "Graphics"}}{{/crossLink}}</li>
 *      <li>Animated bitmaps using {{#crossLink "SpriteSheet"}}{{/crossLink}} and {{#crossLink "BitmapAnimation"}}{{/crossLink}}
 *      <li>Simple text instances using {{#crossLink "Text"}}{{/crossLink}}</li>
 *      <li>Containers that hold other DisplayObjects using {{#crossLink "Container"}}{{/crossLink}}</li>
 *      <li>Control HTML DOM elements using {{#crossLink "DOMElement"}}{{/crossLink}}</li>
 * </ul>
 *
 * All display objects can be added to the stage as children, or drawn to a canvas directly.
 *
 * <b>User Interactions</b><br />
 * All display objects on stage (except DOMElement) will dispatch events when interacted with using a mouse or
 * touch. EaselJS supports hover, press, and release events, as well as an easy-to-use drag-and-drop model. Check out
 * {{#crossLink "MouseEvent"}}{{/crossLink}} for more information.
 *
 * <h4>Simple Example</h4>
 * This example illustrates how to create and position a {{#crossLink "Shape"}}{{/crossLink}} on the {{#crossLink "Stage"}}{{/crossLink}}
 * using EaselJS' drawing API.
 *
 *	    //Create a stage by getting a reference to the canvas
 *	    stage = new createjs.Stage("demoCanvas");
 *	    //Create a Shape DisplayObject.
 *	    circle = new createjs.Shape();
 *	    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
 *	    //Set position of Shape instance.
 *	    circle.x = circle.y = 50;
 *	    //Add Shape instance to stage display list.
 *	    stage.addChild(circle);
 *	    //Update stage will render next frame
 *	    stage.update();
 *
 * <b>Simple Animation Example</b><br />
 * This example moves the shape created in the previous demo across the screen.
 *
 *	    //Update stage will render next frame
 *	    createjs.Ticker.addEventListener("tick", handleTick);
 *
 *	    function handleTick() {
 *          //Circle will move 10 units to the right.
 *	    	circle.x += 10;
 *	    	//Will cause the circle to wrap back
 * 	    	if (circle.x > stage.canvas.width) { circle.x = 0; }
 *	    	stage.update();
 *	    }
 *
 * <h4>Other Features</h4>
 * EaselJS also has built in support for
 * <ul><li>Canvas features such as {{#crossLink "Shadow"}}{{/crossLink}} and CompositeOperation</li>
 *      <li>{{#crossLink "Ticker"}}{{/crossLink}}, a global heartbeat that objects can subscribe to</li>
 *      <li>Filters, including a provided {{#crossLink "ColorMatrixFilter"}}{{/crossLink}}, {{#crossLink "AlphaMaskFilter"}}{{/crossLink}},
 *      {{#crossLink "AlphaMapFilter"}}{{/crossLink}}, and {{#crossLink "BoxBlurFilter"}}{{/crossLink}}. See {{#crossLink "Filter"}}{{/crossLink}}
 *      for more information</li>
 *      <li>A {{#crossLink "ButtonHelper"}}{{/crossLink}} utility, to easily create interactive buttons</li>
 *      <li>{{#crossLink "SpriteSheetUtils"}}{{/crossLink}} and a {{#crossLink "SpriteSheetBuilder"}}{{/crossLink}} to
 *      help build and manage {{#crossLink "SpriteSheet"}}{{/crossLink}} functionality at run-time.</li>
 * </ul>
 *
 * @module EaselJS
 */

// namespace:
this.createjs = this.createjs||{};

(function() {

createjs.DisplayObjectProps = function(props) {
	var props = props || {};
	this.alpha = props.alpha || 1;
	this.cacheCanvas = props.cacheCanvas || null;
	this.mouseEnabled = props.mouseEnabled || true;

	this.name = props.name || null;
	this.parent = props.parent || null;

	this.regX = props.regX || 0;
	this.regY = props.regY || 0;
	this.rotation = props.rotation || 0;
	this.scaleX = props.scaleX || 1;
	this.scaleY = props.scaleY || 1;
	this.skewX = props.skewX || 0;
	this.skewY = props.skewY || 0;

	this.shadow = props.shadow || null;
	this.visible = props.visible || true;
	this.x = props.x || 0;
	this.y = props.y || 0;
	this.compositeOperation = props.compositeOperation || null;
	this.snapToPixel = props.snapToPixel || false;

	this.filters = null;
	this.cacheID = props.cacheID || 0;
	this.mask = null;
	this.hitArea = null;
	this.cursor = null;
	this._listeners = null;
	this._cacheOffsetX = props._cacheOffsetX || 0;
	this._cacheOffsetY = props._cacheOffsetY || 0;
	this._cacheScale = props._cacheScale || 1;
	this._cacheDataURLID = props._cacheDataURLID || 0;
	this._cacheDataURL = props._cacheDataURL || null;

	this.id = createjs.UID.get();
	this._matrix = new createjs.Matrix2D();
}

/**
 * DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
 * {{#crossLink "Container"}}{{/crossLink}}, {{#crossLink "Bitmap"}}{{/crossLink}}, and {{#crossLink "Shape"}}{{/crossLink}}.
 * DisplayObject is the base class for all display classes in the EaselJS library. It defines the core properties and
 * methods that are shared between all display objects, such as transformation properties (x, y, scaleX, scaleY, etc),
 * caching, and mouse handlers.
 * @class DisplayObject
 * @uses EventDispatcher
 * @constructor
 **/
var DisplayObject = function() {
  this.initialize();
}
var p = DisplayObject.prototype;

	/**
	 * Suppresses errors generated when using features like hitTest, mouse events, and getObjectsUnderPoint with cross
	 * domain content
	 * @property suppressCrossDomainErrors
	 * @static
	 * @type {Boolean}
	 * @default false
	 **/
	DisplayObject.suppressCrossDomainErrors = false;

	/**
	 * @property _hitTestCanvas
	 * @type {HTMLCanvasElement | Object}
	 * @static
	 * @protected
	 **/
	DisplayObject._hitTestCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");
	DisplayObject._hitTestCanvas.width = DisplayObject._hitTestCanvas.height = 1;

	/**
	 * @property _hitTestContext
	 * @type {CanvasRenderingContext2D}
	 * @static
	 * @protected
	 **/
	DisplayObject._hitTestContext = DisplayObject._hitTestCanvas.getContext("2d");

	/**
	 * @property _nextCacheID
	 * @type {Number}
	 * @static
	 * @protected
	 **/
	DisplayObject._nextCacheID = 1;

// events:

	/**
	 * Dispatched when the user presses their left mouse button over the display object. See the 
	 * {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event mousedown
	 * @since 0.6.0
	 */
	 
	/**
	 * Dispatched when the user presses their left mouse button and then releases it while over the display object.
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event click
	 * @since 0.6.0
	 */
	 
	/**
	 * Dispatched when the user double clicks their left mouse button over this display object.
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event dblClick
	 * @since 0.6.0
	 */
	 
	/**
	 * Dispatched when the user's mouse rolls over this display object. This event must be enabled using 
	 * {{#crossLink "Stage.enableMouseOver"}}{{/crossLink}}.
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event mouseover
	 * @since 0.6.0
	 */
	 
	
	/**
	 * Dispatched when the user's mouse rolls out of this display object. This event must be enabled using 
	 * {{#crossLink "Stage/enableMouseOver"}}{{/crossLink}}.
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event mouseout
	 * @since 0.6.0
	 */
	 
	/**
	 * Dispatched on each display object on a stage whenever the stage updates.
	 * This occurs immediately before the rendering (draw) pass. When {{#crossLink "Stage/update"}}{{/crossLink}} is called, first all display objects
	 * on the stage dispatch the tick event, then all of the display objects are drawn to stage. Children will have their
	 * tick event dispatched in order of their depth prior to the event being dispatched on their parent.
	 * @event tick
	 * @param {Object} target The object that dispatched the event.
	 * @param {String} type The event type.
	 * @param {Array} params An array containing any arguments that were passed to the Stage.update() method.
	 * 	For example if you called stage.update("hello"), then the params would be ["hello"].
	 * @since 0.6.0
	 */

// public properties:
	/**
	 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
	 * @property alpha
	 * @type {Number}
	 * @default 1
	 **/
	p.alpha = 1;

	/**
	 * If a cache is active, this returns the canvas that holds the cached version of this display object. See cache()
	 * for more information. READ-ONLY.
	 * @property cacheCanvas
	 * @type {HTMLCanvasElement | Object}
	 * @default null
	 **/
	p.cacheCanvas = null;

	/**
	 * Unique ID for this display object. Makes display objects easier for some uses.
	 * @property id
	 * @type {Number}
	 * @default -1
	 **/
	p.id = -1;

	/**
	 * Indicates whether to include this object when running Stage.getObjectsUnderPoint(), and thus for mouse
	 * interactions. Setting this to true for
	 * Containers will cause the Container to be returned (not its children) regardless of whether it's mouseChildren property
	 * is true.
	 * @property mouseEnabled
	 * @type {Boolean}
	 * @default true
	 **/
	p.mouseEnabled = true;

	/**
	 * An optional name for this display object. Included in toString(). Useful for debugging.
	 * @property name
	 * @type {String}
	 * @default null
	 **/
	p.name = null;

	/**
	 * A reference to the Container or Stage object that contains this display object, or null if it has not been added to
	 * one. READ-ONLY.
	 * @property parent
	 * @final
	 * @type {Container}
	 * @default null
	 **/
	p.parent = null;

	/**
	 * The x offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
	 * it's center, you would set regX and regY to 50.
	 * @property regX
	 * @type {Number}
	 * @default 0
	 **/
	p.regX = 0;

	/**
	 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
	 * it's center, you would set regX and regY to 50.
	 * @property regY
	 * @type {Number}
	 * @default 0
	 **/
	p.regY = 0;

	/**
	 * The rotation in degrees for this display object.
	 * @property rotation
	 * @type {Number}
	 * @default 0
	 **/
	p.rotation = 0;

	/**
	 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
	 * object to twice it's nominal width.
	 * @property scaleX
	 * @type {Number}
	 * @default 1
	 **/
	p.scaleX = 1;

	/**
	 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
	 * object to half it's nominal height.
	 * @property scaleY
	 * @type {Number}
	 * @default 1
	 **/
	p.scaleY = 1;

	/**
	 * The factor to skew this display object horizontally.
	 * @property skewX
	 * @type {Number}
	 * @default 0
	 **/
	p.skewX = 0;

	/**
	 * The factor to skew this display object vertically.
	 * @property skewY
	 * @type {Number}
	 * @default 0
	 **/
	p.skewY = 0;

	/**
	 * A shadow object that defines the shadow to render on this display object. Set to null to remove a shadow. If
	 * null, this property is inherited from the parent container.
	 * @property shadow
	 * @type {Shadow}
	 * @default null
	 **/
	p.shadow = null;

	/**
	 * Indicates whether this display object should be rendered to the canvas and included when running
	 * Stage.getObjectsUnderPoint().
	 * @property visible
	 * @type {Boolean}
	 * @default true
	 **/
	p.visible = true;

	/**
	 * The x (horizontal) position of the display object, relative to its parent.
	 * @property x
	 * @type {Number}
	 * @default 0
	 **/
	p.x = 0;

	/** The y (vertical) position of the display object, relative to its parent.
	 * @property y
	 * @type {Number}
	 * @default 0
	 **/
	p.y = 0;

	/**
	 * The composite operation indicates how the pixels of this display object will be composited with the elements
	 * behind it. If null, this property is inherited from the parent container. For more information, read the
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
	 * whatwg spec on compositing</a>.
	 * @property compositeOperation
	 * @type {String}
	 * @default null
	 **/
	p.compositeOperation = null;

	/**
	 * Indicates whether the display object should have it's x & y position rounded prior to drawing it to stage.
	 * Snapping to whole pixels can result in a sharper and faster draw for images (ex. Bitmap & cached objects).
	 * This only applies if the enclosing stage has snapPixelsEnabled set to true. The snapToPixel property is true
	 * by default for Bitmap and BitmapAnimation instances, and false for all other display objects.
	 * <br/><br/>
	 * Note that this applies only rounds the display object's local position. You should
	 * ensure that all of the display object's ancestors (parent containers) are also on a whole pixel. You can do this
	 * by setting the ancestors' snapToPixel property to true.
	 * @property snapToPixel
	 * @type {Boolean}
	 * @default false
	 * @deprecated Hardware acceleration in modern browsers makes this unnecessary.
	 **/
	p.snapToPixel = false;
	 
	/**
	 * The onPress callback is called when the user presses down on their mouse over this display object. The handler
	 * is passed a single param containing the corresponding MouseEvent instance. You can subscribe to the onMouseMove
	 * and onMouseUp callbacks of the event object to receive these events until the user releases the mouse button.
	 * If an onPress handler is set on a container, it will receive the event if any of its children are clicked.
	 * @property onPress
	 * @type {Function}
	 * @deprecated In favour of the "mousedown" event. Will be removed in a future version.
	 */
	p.onPress = null;	 
	 
	/**
	 * The onClick callback is called when the user presses down on and then releases the mouse button over this
	 * display object. The handler is passed a single param containing the corresponding MouseEvent instance. If an
	 * onClick handler is set on a container, it will receive the event if any of its children are clicked.
	 * @property onClick
	 * @type {Function}
	 * @deprecated In favour of the "click" event. Will be removed in a future version.
	 */
	p.onClick = null;

	/**
	 * The onDoubleClick callback is called when the user double clicks over this display object. The handler is
	 * passed a single param containing the corresponding MouseEvent instance. If an onDoubleClick handler is set
	 * on a container, it will receive the event if any of its children are clicked.
	 * @property onDoubleClick
	 * @type {Function}
	 * @deprecated In favour of the "dblClick" event. Will be removed in a future version.
	 */
	p.onDoubleClick = null;

	/**
	 * The onMouseOver callback is called when the user rolls over the display object. You must enable this event using
	 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEvent instance.
	 * @property onMouseOver
	 * @type {Function}
	 * @deprecated In favour of the "mouseover" event. Will be removed in a future version.
	 */
	p.onMouseOver = null;

	/**
	 * The onMouseOut callback is called when the user rolls off of the display object. You must enable this event using
	 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEvent instance.
	 * @property onMouseOut
	 * @type {Function}
	 * @deprecated In favour of the "mouseout" event. Will be removed in a future version.
	 */
	p.onMouseOut = null;
	 
	/**
	 * The onTick callback is called on each display object on a stage whenever the stage updates.
	 * This occurs immediately before the rendering (draw) pass. When stage.update() is called, first all display objects
	 * on the stage have onTick called, then all of the display objects are drawn to stage. Children will have their
	 * onTick called in order of their depth prior to onTick being called on their parent.
	 * <br/><br/>
	 * Any parameters passed in to stage.update() are passed on to the onTick() handlers. For example, if you call
	 * stage.update("hello"), all of the display objects with a handler will have onTick("hello") called.
	 * @property onTick
	 * @type {Function}
	 * @deprecated In favour of the "tick" event. Will be removed in a future version.
	 */
	p.onTick = null;

	/**
	 * An array of Filter objects to apply to this display object. Filters are only applied / updated when cache() or
	 * updateCache() is called on the display object, and only apply to the area that is cached.
	 * @property filters
	 * @type {Array}
	 * @default null
	 **/
	p.filters = null;

	/**
	* Returns an ID number that uniquely identifies the current cache for this display object.
	* This can be used to determine if the cache has changed since a previous check.
	* @property cacheID
	* @type {Number}
	* @default 0
	*/
	p.cacheID = 0;
	
	/**
	 * A Shape instance that defines a vector mask (clipping path) for this display object.  The shape's transformation
	 * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
	 * @property mask
	 * @type {Shape}
	 * @default null
	 */
	p.mask = null;
	
	/**
	 * A display object that will be tested when checking mouse interactions or testing getObjectsUnderPoint. The hit area
	 * will have its transformation applied relative to this display object's coordinate space (as though the hit test object were a child of this
	 * display object and relative to its regX/Y). The hitArea will be tested using only its own alpha value regardless of the alpha value on
	 * the target display object, or the target's ancestors (parents). hitArea is NOT currently used by the hitTest() method.
	 * 
	 * Note that hitArea is not supported for Stage.
	 * @property hitArea
	 * @type {DisplayObject}
	 * @default null
	 */
	p.hitArea = null;
	
	/**
	 * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display object. You must enable
	 * mouseover events using the stage.enableMouseOver() method to use this property. If null it will use the default cursor.
	 * @property cursor
	 * @type {String}
	 * @default null
	 */
	p.cursor = null;
	
	
// mix-ins:
	// EventDispatcher methods:
	p.addEventListener = null;
	p.removeEventListener = null;
	p.removeAllEventListeners = null;
	p.dispatchEvent = null;
	p.hasEventListener = null;
	p._listeners = null;
	createjs.EventDispatcher.initialize(p); // inject EventDispatcher methods.
	

// private properties:

	/**
	 * @property _cacheOffsetX
	 * @protected
	 * @type {Number}
	 * @default 0
	 **/
	p._cacheOffsetX = 0;

	/**
	 * @property _cacheOffsetY
	 * @protected
	 * @type {Number}
	 * @default 0
	 **/
	p._cacheOffsetY = 0;
	
	/**
	 * @property _cacheScale
	 * @protected
	 * @type {Number}
	 * @default 1
	 **/
	p._cacheScale = 1;

	/**
	* @property _cacheDataURLID
	* @protected
	* @type {Number}
	* @default 0
	*/
	p._cacheDataURLID = 0;
	
	/**
	* @property _cacheDataURL
	* @protected
	* @type {String}
	* @default null
	*/
	p._cacheDataURL = null;

	/**
	 * @property _matrix
	 * @protected
	 * @type {Matrix2D}
	 * @default null
	 **/
	p._matrix = null;
	

// constructor:
	// separated so it can be easily addressed in subclasses:

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function() {
		this.props = new createjs.DisplayObjectProps(Object.getPrototypeOf(this).props);
	}

// public methods:
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		var props = this.props;
		return !(!props.visible || !(0 < props.alpha && 0 != props.scaleX && 0 != props.scaleY));
	}

	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		var props = this.props;
		var cacheCanvas = props.cacheCanvas;
		if (ignoreCache || !cacheCanvas) { return false; }
		var scale = props._cacheScale;
		ctx.drawImage(cacheCanvas, props._cacheOffsetX, props._cacheOffsetY, cacheCanvas.width / scale, cacheCanvas.height / scale);
		return true;
	}
	
	/**
	 * Applies this display object's transformation, alpha, globalCompositeOperation, clipping path (mask), and shadow to the specified
	 * context. This is typically called prior to draw.
	 * @method setupContext
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
	 **/
	p.updateContext = function(ctx) {
		var props = this.props, mtx, mask = props.mask;
		
		if (mask && mask.graphics && !mask.graphics.isEmpty()) {
			mtx = mask.getMatrix(mask._matrix);
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
			
			mask.graphics.drawAsPath(ctx);
			ctx.clip();
			
			mtx.invert();
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		}
		
		mtx = props._matrix.identity().appendTransform(props.x, props.y, props.scaleX, props.scaleY, props.rotation, props.skewX, props.skewY, props.regX, props.regY);
		// TODO: should be a better way to manage this setting. For now, using dynamic access to avoid circular dependencies:
		if (createjs["Stage"]._snapToPixelEnabled && props.snapToPixel) { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx+0.5|0, mtx.ty+0.5|0); }
		else { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
		ctx.globalAlpha *= props.alpha;
		if (props.compositeOperation) { ctx.globalCompositeOperation = props.compositeOperation; }
		if (props.shadow) { this._applyShadow(ctx, props.shadow); }
	}

	/**
	 * Draws the display object into a new canvas, which is then used for subsequent draws. For complex content
	 * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
	 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
	 * cached display object can be moved, rotated, faded, etc freely, however if it's content changes, you must manually
	 * update the cache by calling updateCache() or cache() again. You must specify the cache area via the x, y, w,
	 * and h parameters. This defines the rectangle that will be rendered and cached using this display object's
	 * coordinates. For example if you defined a Shape that drew a circle at 0, 0 with a radius of 25, you could call
	 * myShape.cache(-25, -25, 50, 50) to cache the full shape.
	 * @method cache
	 * @param {Number} x The x coordinate origin for the cache region.
	 * @param {Number} y The y coordinate origin for the cache region.
	 * @param {Number} width The width of the cache region.
	 * @param {Number} height The height of the cache region.
	 * @param {Number} scale Optional. The scale at which the cache will be created. For example, if you cache a vector shape using
	 * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
	 * 	cached elements with greater fidelity. Default is 1.
	 **/
	p.cache = function(x, y, width, height, scale) {
		// draw to canvas.
		var props = this.props;
		scale = scale||1;
		if (!props.cacheCanvas) { props.cacheCanvas = createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"); }
		props.cacheCanvas.width = Math.ceil(width*scale);
		props.cacheCanvas.height = Math.ceil(height*scale);
		props._cacheOffsetX = x;
		props._cacheOffsetY = y;
		props._cacheScale = scale||1;
		this.updateCache();
	}

	/**
	 * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
	 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
	 * will be drawn over the existing cache using the specified compositeOperation.
	 * @method updateCache
	 * @param {String} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
	 * whatwg spec on compositing</a>.
	 **/
	p.updateCache = function(compositeOperation) {
		var props = this.props,
			cacheCanvas = props.cacheCanvas, scale = props._cacheScale, offX = props._cacheOffsetX*scale, offY = props._cacheOffsetY*scale;
		if (!cacheCanvas) { throw "cache() must be called before updateCache()"; }
		var ctx = cacheCanvas.getContext("2d");
		ctx.save();
		if (!compositeOperation) { ctx.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height); }
		ctx.globalCompositeOperation = compositeOperation;
		ctx.setTransform(scale, 0, 0, scale, -offX, -offY);
		this.draw(ctx, true);
		this._applyFilters();
		ctx.restore();
		props.cacheID = DisplayObject._nextCacheID++;
	}

	/**
	 * Clears the current cache. See cache() for more information.
	 * @method uncache
	 **/
	p.uncache = function() {
		var props = this.props;
		props._cacheDataURL = props.cacheCanvas = null;
		props.cacheID = props._cacheOffsetX = props._cacheOffsetY = 0;
		props._cacheScale = 1;
	}
	
	/**
	* Returns a data URL for the cache, or null if this display object is not cached.
	* Uses cacheID to ensure a new data URL is not generated if the cache has not changed.
	* @method getCacheDataURL.
	**/
	p.getCacheDataURL = function() {
		var props = this.props;
		if (!props.cacheCanvas) { return null; }
		if (props.cacheID != props._cacheDataURLID) { props._cacheDataURL = props.cacheCanvas.toDataURL(); }
		return props._cacheDataURL;
	}

	/**
	 * Returns the stage that this display object will be rendered on, or null if it has not been added to one.
	 * @method getStage
	 * @return {Stage} The Stage instance that the display object is a descendent of. null if the DisplayObject has not
	 * been added to a Stage.
	 **/
	p.getStage = function() {
		var o = this;
		while (o.parent) {
			o = o.props.parent;
		}
		// using dynamic access to avoid circular dependencies;
		if (o instanceof createjs["Stage"]) { return o; }
		return null;
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of the display object
	 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
	 * over a specific point on a nested display object. Returns a Point instance with x and y properties
	 * correlating to the transformed coordinates on the stage.
	 * @method localToGlobal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position in the source display object to transform.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed coordinates
	 * on the stage.
	 **/
	p.localToGlobal = function(x, y) {
		var props = this.props,
			mtx = this.getConcatenatedMatrix(props._matrix);
		if (mtx == null) { return null; }
		mtx.append(1, 0, 0, 1, x, y);
		return new createjs.Point(mtx.tx, mtx.ty);
	}

	/**
	 * Transforms the specified x and y position from the global (stage) coordinate space to the
	 * coordinate space of the display object. For example, this could be used to determine
	 * the current mouse position within the display object. Returns a Point instance with x and y properties
	 * correlating to the transformed position in the display object's coordinate space.
	 * @method globalToLocal
	 * @param {Number} x The x position on the stage to transform.
	 * @param {Number} y The y position on the stage to transform.
	 * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
	 * display object's coordinate space.
	 **/
	p.globalToLocal = function(x, y) {
		var props = this.props,
		var mtx = this.getConcatenatedMatrix(props._matrix);
		if (mtx == null) { return null; }
		mtx.invert();
		mtx.append(1, 0, 0, 1, x, y);
		return new createjs.Point(mtx.tx, mtx.ty);
	}

	/**
	 * Transforms the specified x and y position from the coordinate space of this display object to the
	 * coordinate space of the target display object. Returns a Point instance with x and y properties
	 * correlating to the transformed position in the target's coordinate space. Effectively the same as calling
	 * var pt = this.localToGlobal(x, y); pt = target.globalToLocal(pt.x, pt.y);
	 * @method localToLocal
	 * @param {Number} x The x position in the source display object to transform.
	 * @param {Number} y The y position on the stage to transform.
	 * @param {DisplayObject} target The target display object to which the coordinates will be transformed.
	 * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
	 * in the target's coordinate space.
	 **/
	p.localToLocal = function(x, y, target) {
		var pt = this.localToGlobal(x, y);
		return target.globalToLocal(pt.x, pt.y);
	}

	/**
	 * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
	 * Omitted parameters will have the default value set (ex. 0 for x/y, 1 for scaleX/Y).
	 * @method setTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX
	 * @param {Number} regY
	 * @return {DisplayObject} Returns this instance. Useful for chaining commands.
	*/
	p.setTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		var props = this.props;
		props.x = x || 0;
		props.y = y || 0;
		props.scaleX = scaleX == null ? 1 : scaleX;
		props.scaleY = scaleY == null ? 1 : scaleY;
		props.rotation = rotation || 0;
		props.skewX = skewX || 0;
		props.skewY = skewY || 0;
		props.regX = regX || 0;
		props.regY = regY || 0;
		return this;
	}
	
	/**
	 * Returns a matrix based on this object's transform.
	 * @method getMatrix
	 * @param {Matrix2D} matrix Optional. A Matrix2D object to populate with the calculated values. If null, a new
	 * Matrix object is returned.
	 * @return {Matrix2D} A matrix representing this display object's transform.
	 **/
	p.getMatrix = function(matrix) {
		var props = this.props;
		return (matrix ? matrix.identity() : new createjs.Matrix2D()).appendTransform(props.x, props.y, props.scaleX, props.scaleY, props.rotation, props.skewX, props.skewY, props.regX, props.regY).appendProperties(props.alpha, props.shadow, props.compositeOperation);
	}
	
	/**
	 * Generates a concatenated Matrix2D object representing the combined transform of
	 * the display object and all of its parent Containers up to the highest level ancestor
	 * (usually the stage). This can be used to transform positions between coordinate spaces,
	 * such as with localToGlobal and globalToLocal.
	 * @method getConcatenatedMatrix
	 * @param {Matrix2D} mtx Optional. A Matrix2D object to populate with the calculated values. If null, a new
	 * Matrix object is returned.
	 * @return {Matrix2D} a concatenated Matrix2D object representing the combined transform of
	 * the display object and all of its parent Containers up to the highest level ancestor (usually the stage).
	 **/
	p.getConcatenatedMatrix = function(matrix) {
		var props;
		if (matrix) { matrix.identity(); }
		else { matrix = new createjs.Matrix2D(); }
		var o = this;
		while (o != null) {
			props = o.props;
			matrix.prependTransform(props.x, props.y, props.scaleX, props.scaleY, props.rotation, props.skewX, props.skewY, props.regX, props.regY).prependProperties(props.alpha, props.shadow, props.compositeOperation);
			o = props.parent;
		}
		return matrix;
	}

	/**
	 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at
	 * the specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
	 * transform properties including regX/Y.
	 * @method hitTest
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicting whether a visible portion of the DisplayObject intersect the specified
	 * local Point.
	*/
	p.hitTest = function(x, y) {
		var ctx = DisplayObject._hitTestContext;
		var canvas = DisplayObject._hitTestCanvas;

		ctx.setTransform(1,  0, 0, 1, -x, -y);
		this.draw(ctx);

		var hit = this._testHit(ctx);

		canvas.width = 0;
		canvas.width = 1;
		return hit;
	};
	
	/**
	 * Provides a chainable shortcut method for setting a number of properties on a DisplayObject instance. Ex.<br/>
	 * var shape = stage.addChild( new Shape() ).set({graphics:myGraphics, x:100, y:100, alpha:0.5});
	 * @method set
	 * @param {Object} props A generic object containing properties to copy to the DisplayObject instance.
	 * @return {DisplayObject} Returns The DisplayObject instance the method is called on (useful for chaining calls.)
	*/
	p.set = function(props) {
		for (var n in props) { this[n] = props[n]; }
		return this;
	}

	/**
	 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent).
	 * @method clone
	 * @return {DisplayObject} A clone of the current DisplayObject instance.
	 **/
	p.clone = function() {
		var o = new DisplayObject();
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[DisplayObject (name="+  this.name +")]";
	}

// private methods:

	// separated so it can be used more easily in subclasses:
	/**
	 * @method cloneProps
	 * @protected
	 * @param {DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
	 * instance copied into.
	 **/
	p.cloneProps = function(o) {
		var props = this.props, newProps = o.props;
		newProps.alpha = props.alpha;
		newProps.name = props.name;
		newProps.regX = props.regX;
		newProps.regY = props.regY;
		newProps.rotation = props.rotation;
		newProps.scaleX = props.scaleX;
		newProps.scaleY = props.scaleY;
		newProps.shadow = props.shadow;
		newProps.skewX = props.skewX;
		newProps.skewY = props.skewY;
		newProps.visible = props.visible;
		newProps.x = props.x;
		newProps.y = props.y;
		newProps.mouseEnabled = props.mouseEnabled;
		newProps.compositeOperation = props.compositeOperation;
		if (props.cacheCanvas) {
			newProps.cacheCanvas = props.cacheCanvas.cloneNode(true);
			newProps.cacheCanvas.getContext("2d").putImageData(props.cacheCanvas.getContext("2d").getImageData(0,0,props.cacheCanvas.width,props.cacheCanvas.height),0,0);
		}
	}

	/**
	 * @method _applyShadow
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Shadow} shadow
	 **/
	p._applyShadow = function(ctx, shadow) {
		shadow = shadow || Shadow.identity;
		ctx.shadowColor = shadow.color;
		ctx.shadowOffsetX = shadow.offsetX;
		ctx.shadowOffsetY = shadow.offsetY;
		ctx.shadowBlur = shadow.blur;
	}
	
	
	/**
	 * @method _tick
	 * @protected
	 **/
	p._tick = function(params) {
		var props = this.props;
		this.onTick&&this.onTick.apply(this, params);
		// because onTick can be really performance sensitive, we'll inline some of the dispatchEvent work.
		// this can probably go away at some point. It only has a noticeable impact with thousands of objects in modern browsers.
		var ls = props._listeners;
		if (ls&&ls["tick"]) { this.dispatchEvent({type:"tick",params:params}); }
	}

	/**
	 * @method _testHit
	 * @protected
	 * @param {CanvasRenderingContext2D} ctx
	 * @return {Boolean}
	 **/
	p._testHit = function(ctx) {
		try {
			var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
		} catch (e) {
			if (!DisplayObject.suppressCrossDomainErrors) {
				throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
			}
		}
		return hit;
	}

	/**
	 * @method _applyFilters
	 * @protected
	 **/
	p._applyFilters = function() {
		var props = this.props;
		if (!props.filters || props.filters.length == 0 || !props.cacheCanvas) { return; }
		var l = props.filters.length;
		var ctx = props.cacheCanvas.getContext("2d");
		var w = props.cacheCanvas.width;
		var h = props.cacheCanvas.height;
		for (var i=0; i<l; i++) {
			props.filters[i].applyFilter(ctx, 0, 0, w, h);
		}
	};
	
	/**
	 * Indicates whether the display object has a listener of the corresponding event types.
	 * @method _hasMouseHandler
	 * @param {Number} typeMask A bitmask indicating which event types to look for. Bit 1 specifies press &
	 * click & double click, bit 2 specifies it should look for mouse over and mouse out. This implementation may change.
	 * @return {Boolean}
	 * @protected
	 **/
	p._hasMouseHandler = function(typeMask) {
		var props = this.props,
			ls = this._listeners;
		return !!(
				 (typeMask&1 && (this.onPress || this.onClick || this.onDoubleClick ||
				 (ls && (this.hasEventListener("mousedown") || this.hasEventListener("click") || this.hasEventListener("dblclick")))))
				 ||
				 (typeMask&2 && (this.onMouseOver || this.onMouseOut || props.cursor ||
				 (ls && (this.hasEventListener("mouseover") || this.hasEventListener("mouseout")))))
				 );
	};
	 
	Object.defineProperty(p, "alpha", {
		get: function get_alpha() { return this.props.alpha; },
		set: function set_alpha(v) {this.props.alpha = v;}
	});

	Object.defineProperty(p, "cacheCanvas", {
		get: function get_cacheCanvas() { return this.props.cacheCanvas; },
		set: function set_cacheCanvas(v) {this.props.cacheCanvas = v;}
	});

	Object.defineProperty(p, "id", {
		get: function get_id() { return this.props.id; },
		set: function set_id(v) {this.props.id = v;}
	});

	Object.defineProperty(p, "mouseEnabled", {
		get: function get_mouseEnabled() { return this.props.mouseEnabled; },
		set: function set_mosueEnabled(v) {this.props.mouseEnabled = v;}
	});

	Object.defineProperty(p, "name", {
		get: function get_name() { return this.props.name; },
		set: function set_name(v) {this.props.name = v;}
	});

	Object.defineProperty(p, "parent", {
		get: function get_parent() { return this.props.parent; },
		set: function set_parent(v) {this.props.parent = v;}
	});

	Object.defineProperty(p, "regX", {
		get: function get_regX() { return this.props.regX; },
		set: function set_regX(v) {this.props.regX = v;}
	});

	Object.defineProperty(p, "regY", {
		get: function get_regY() { return this.props.regY; },
		set: function set_regY(v) {this.props.regY = v;}
	});

	Object.defineProperty(p, "rotation", {
		get: function get_rotation() { return this.props.rotation; },
		set: function set_rotation(v) {this.props.rotation = v;}
	});

	Object.defineProperty(p, "scaleX", {
		get: function get_scaleX() { return this.props.scaleX; },
		set: function set_scaleX(v) {this.props.scaleX = v;}
	});

	Object.defineProperty(p, "scaleY", {
		get: function get_scaleY() { return this.props.scaleY; },
		set: function set_scaleY(v) {this.props.scaleY = v;}
	});

	Object.defineProperty(p, "skewX", {
		get: function get_skewX() { return this.props.skewX; },
		set: function set_skewX(v) {this.props.skewX = v;}
	});

	Object.defineProperty(p, "skewY", {
		get: function get_skewY() { return this.props.skewY; },
		set: function set_skewY(v) {this.props.skewY = v;}
	});

	Object.defineProperty(p, "shadow", {
		get: function get_shadow() { return this.props.shadow; },
		set: function set_shadow(v) {this.props.shadow = v;}
	});

	Object.defineProperty(p, "visible", {
		get: function get_visible() { return this.props.visible; },
		set: function set_visible(v) {this.props.visible = v;}
	});

	Object.defineProperty(p, "x", {
		get: function get_x() { return this.props.x; },
		set: function set_x(v) {this.props.x = v;}
	});

	Object.defineProperty(p, "y", {
		get: function get_y() { return this.props.y; },
		set: function set_y(v) {this.props.y = v;}
	});

	Object.defineProperty(p, "compositeOperation", {
		get: function get_compositeOperation() { return this.props.compositeOperation; },
		set: function set_compositeOperation(v) {this.props.compositeOperation = v;}
	});

	Object.defineProperty(p, "snapToPixel", {
		get: function get_snapToPixel() { return this.props.snapToPixel; },
		set: function set_snapToPixel(v) {this.props.snapToPixel = v;}
	});

	Object.defineProperty(p, "filters", {
		get: function get_filters() { return this.props.filters; },
		set: function set_filters(v) {this.props.filters = v;}
	});

	Object.defineProperty(p, "cacheID", {
		get: function get_cacheID() { return this.props.cacheID; },
		set: function set_cacheID(v) {this.props.cacheID = v;}
	});

	Object.defineProperty(p, "mask", {
		get: function get_mask() { return this.props.mask; },
		set: function set_mask(v) {this.props.mask = v;}
	});

	Object.defineProperty(p, "hitArea", {
		get: function get_hitArea() { return this.props.hitArea; },
		set: function set_hitArea(v) {this.props.hitArea = v;}
	});

	Object.defineProperty(p, "cursor", {
		get: function get_cursor() { return this.props.cursor; },
		set: function set_cursor(v) {this.props.cursor = v;}
	});

	Object.defineProperty(p, "_listeners", {
		get: function get__listeners() { return this.props._listeners; },
		set: function set__listeners(v) {this.props._listeners = v;}
	});

	Object.defineProperty(p, "_cacheOffsetX", {
		get: function get__cacheOffsetX() { return this.props._cacheOffsetX; },
		set: function set__cacheOffsetX(v) {this.props._cacheOffsetX = v;}
	});

	Object.defineProperty(p, "_cacheOffsetY", {
		get: function get__cacheOffsetY() { return this.props._cacheOffsetY; },
		set: function set__cacheOffsetY(v) {this.props._cacheOffsetY = v;}
	});

	Object.defineProperty(p, "_cacheScale", {
		get: function get__cacheScale() { return this.props._cacheScale; },
		set: function set__cacheScale(v) {this.props._cacheScale = v;}
	});

	Object.defineProperty(p, "_cacheDataURLID", {
		get: function get__cacheDataURLID() { return this.props._cacheDataURLID; },
		set: function set__cacheDataURLID(v) {this.props._cacheDataURLID = v;}
	});

	Object.defineProperty(p, "_cacheDataURL", {
		get: function get__cacheDataURL() { return this.props._cacheDataURL; },
		set: function set__cacheDataURL(v) {this.props._cacheDataURL = v;}
	});

	Object.defineProperty(p, "_matrix", {
		get: function get__matrix() { return this.props._matrix; },
		set: function set__matrix(v) {this.props._matrix = v;}
	});

	createjs.DisplayObject = DisplayObject;
}());