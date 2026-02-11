  
  
  

  
  import { CheckCircle2, Timer } from 'lucide-react';
  

 

  
export const AVAILABLE_OPTIONS = [
  {
    name: "Color",
    viewin:['chargers','powerbanks','cables','headphones','tws','speakers','otg','neckbands','earphones'],
    values: ["Black", "White", "Blue", "Red", "Silver", "Gold", "Rose Gold", "Green", "Purple", "Orange", "Yellow", "Camouflage", "Metallic", "Gun-Black", "Peach"]
  },
  {
    name: "Cable-Color",
    viewin:[],
    values: ["Black", "White", "Blue", "Red", "Silver", "Gold", "Rose Gold", "Green", "Purple", "Orange"]
  },
  {
    name: "Wattage",
    viewin:['chargers','cables'],
    values: ["5W", "8W", "10W", "12W","15W", "18W", "20W", "25W", "30W", "33W","44W","48W", "45W","60W", "65W","80W", "100W", "120W", '3AMP']
  },
 {
  name: "Cable Type",
  viewin:['chargers','cables'],
  values: [
    "USB-A to Type-C",
    "USB-A to V8",
    "USB-A to Lightning",
    "Type-C to Type-C",
    "Type-C to V8",
    "Type-C to Lightning",
    "3-in-1 USB-A to (Type-C + V8 + Lightning)",
    "Type-C to 3.5mm",
  ]
},
{
    name: "Ports",
    viewin:['chargers','earphones'],
    values: ["USB", "Type-C", "Dual-USB", "QC+PD","3.5mm"]
  },
  {
    name: "OTG Ports",
    viewin:['otg'],
    values: ["4-in-1", "BT-Receiver", "2-in-1", "Aux to C","Aux to 3.5mm", "USB to V8", "USB to C", "USB to IOS", "Type-C to USB", "IOS to V8", "C to IOS", "C to V8", "V8 to IOS", "V8 to C", 'Card-Reader']
  },
  {
    name: "Quantity",
    viewin:[],
    values: ["1 Piece", "2 Pieces", "3 Pieces", "6 Pieces", "12 Pieces", "24 Pieces"]
  },
  {
    name: "Holder Type",
    viewin:["mobileholder"],
    values: ["Bike", "Car", "Table Top"]
  },
  {
    name: "Cable Length",
    viewin:['cables'],
    values: ["0.5m", "1m", "1.2m", "1.5m", "2m", "3m", "5m"]
  },
  {
    name: "Capacity",
    viewin:['powerbanks'],
    values: ["5000mAh", "10000mAh", "15000mAh", "20000mAh", "30000mAh", "50000mAh"]
  },
  {
    name: "Packaging",
    viewin:['cables', 'neckbands','earphones'],
    values: ["SBS", "Poly Pack", "Rigid Box", "Corrugated"]
  },
 
];

export const PARENT_CATEGORIES = [
  { _id: "accessories", name: "Accessories" },
  { _id: "batteries", name: "Batteries" }
];

export const CATEGORIES = {
  accessories: [
    { _id: "powerbanks", name: "Power Banks" },
    { _id: "chargers", name: "Chargers" },
    { _id: "carchargers", name: "Car Chargers" },
    { _id: "cables", name: "Cables" },
    { _id: "headphones", name: "Headphones" },
    { _id: "tws", name: "TWS" },
    { _id: "speakers", name: "Speakers" },
    { _id: "otg", name: "OTG" },
    { _id: "neckbands", name: "Neckbands" },
    { _id: "earphones", name: "Earphones" },
    { _id: "mobileholder", name: "Mobile Holder" },
  ],
  batteries: [
    { _id: "polymer", name: "Polymer" },
    { _id: "lithium", name: "Lithium" }
  ]
};


export const GST_TAX_RATES = [
  { code: "NILL", label: "NILL", rate: 0 },
  { code: "GST0", label: "GST 0% - Essential Items", rate: 0 },
  { code: "GST5", label: "GST 5% - Household Necessities", rate: 5 },
  { code: "GST12", label: "GST 12% - Processed Foods", rate: 12 },
  { code: "GST18", label: "GST 18% - Standard Rate", rate: 18 },
  { code: "GST28", label: "GST 28% - Luxury Items", rate: 28 },
];
