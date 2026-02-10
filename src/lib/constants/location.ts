
export const STATES = [
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'tamil_nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
  { value: 'west_bengal', label: 'West Bengal' },
  { value: 'kerala', label: 'Kerala' }
] as const;

export const CITY_MAP = {
  maharashtra: [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
    { value: 'nagpur', label: 'Nagpur' },
    { value: 'nashik', label: 'Nashik' }
  ],
  karnataka: [
    { value: 'bengaluru', label: 'Bengaluru' },
    { value: 'mysuru', label: 'Mysuru' },
    { value: 'mangaluru', label: 'Mangaluru' }
  ],
  delhi: [
    { value: 'new_delhi', label: 'New Delhi' }
  ],
  tamil_nadu: [
    { value: 'chennai', label: 'Chennai' },
    { value: 'coimbatore', label: 'Coimbatore' }
  ],
  telangana: [
    { value: 'hyderabad', label: 'Hyderabad' }
  ],
  gujarat: [
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { value: 'surat', label: 'Surat' }
  ],
  rajasthan: [
    { value: 'jaipur', label: 'Jaipur' }
  ],
  uttar_pradesh: [
    { value: 'lucknow', label: 'Lucknow' },
    { value: 'noida', label: 'Noida' }
  ],
  west_bengal: [
    { value: 'kolkata', label: 'Kolkata' }
  ],
  kerala: [
    { value: 'kochi', label: 'Kochi' },
    { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' }
  ]
} as const;


export type State = (typeof STATES)[number]['value'];
export type City = (typeof CITY_MAP)[State][number]['value'];

export const STATE_VALUES = STATES.map(s => s.value);

export const CITY_VALUES = Object.values(CITY_MAP)
  .flat()
  .map(c => c.value);
