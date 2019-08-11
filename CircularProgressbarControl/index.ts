import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class CircularProgressbarControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _progressBarValue: number;

	//div to hold all UI elements we create
	private _container: HTMLDivElement;

	//circular progressbar
	private _divLoader: HTMLDivElement;
	private _divSlice: HTMLDivElement;
	private _divBar: HTMLDivElement;
	private _divFill: HTMLDivElement;

	//span element that display's the percentage 
	private _spanProgressPrecentsge: HTMLSpanElement;

	//range slider
	private _divSliderContainer: HTMLDivElement;
	private _inputRangeSlider: HTMLInputElement;

	// Event Handler 'refreshData' reference
	private _refreshData: EventListenerOrEventListenerObject;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */

	public init(context: ComponentFramework.Context<IInputs>, 
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		 container: HTMLDivElement) {


		// Add control initialization code

		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._progressBarValue = context.parameters.progressbarProperty.raw != null  ? context.parameters.progressbarProperty.raw : 0;
		this._refreshData = this.refreshData.bind(this);

		//creating a div container
		this._container = document.createElement("div");

		//creating a circular progress bar
		this._divLoader = document.createElement("div");
		this._divSlice = document.createElement("div");
		this._divBar = document.createElement("div");
		this._divFill = document.createElement("div");
		this._spanProgressPrecentsge = document.createElement("span");

		// adding styles to the circular progressbar
		this._divLoader.className = "c100 p" + this._progressBarValue + " dark";
		this._divSlice.className = "slice";
		this._divBar.className = "bar";
		this._divFill.className = "fill";
		this._spanProgressPrecentsge.innerHTML = this._progressBarValue + "%";

		//creating a div that contains the slider 
		this._divSliderContainer = document.createElement("div");
		this._divSliderContainer.className = "slidecontainer";

		//creating a range slider and adding required attributes  
		this._inputRangeSlider = document.createElement("input");
		this._inputRangeSlider.type = "range";
		this._inputRangeSlider.min = "0";
		this._inputRangeSlider.max = "100";
		this._inputRangeSlider.className = "slider";

		//binding a value and adding an event to the range slider
		this._inputRangeSlider.setAttribute("value", context.parameters.progressbarProperty.formatted != null ? context.parameters.progressbarProperty.formatted : "0");
		this._inputRangeSlider.addEventListener("input", this._refreshData);

		// appending the div progressbar  
		this._divSlice.appendChild(this._divBar);
		this._divSlice.appendChild(this._divFill);
		this._divLoader.appendChild(this._spanProgressPrecentsge);
		this._divLoader.appendChild(this._divSlice);

		// appending the range slider to the slider container   
		this._divSliderContainer.appendChild(this._inputRangeSlider);

		//appending the circular progress bar and range slider div   
		this._container.appendChild(this._divLoader);
		this._container.appendChild(this._divSliderContainer);

		//appending the _container to the main container
		container.appendChild(this._container);

	}

	// event to change the data when the slider is moved
	public refreshData(evt: Event): void {
		this._progressBarValue = (this._inputRangeSlider.value as any) as number;
		this._notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		//assigning the latest value to the private variables  
		this._context = context;
		this._progressBarValue = context.parameters.progressbarProperty.raw;

		//modifying the UI as per new outputs 
		this._divLoader.className = "c100 p" + this._progressBarValue + " dark";
		this._spanProgressPrecentsge.innerHTML = this._progressBarValue + " %";
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			//Changing the property value to the latest output
			progressbarProperty: this._progressBarValue
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		this._inputRangeSlider.removeEventListener("input", this._refreshData);
	}



}