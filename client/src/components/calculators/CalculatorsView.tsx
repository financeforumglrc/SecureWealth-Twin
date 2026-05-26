import { useState } from 'react';
import RentVsBuyCalculator from './RentVsBuyCalculator';

export default function CalculatorsView() {
  const [activeCalc, setActiveCalc] = useState<'sip' | 'emi' | 'retirement' | 'rentvsbuy'>('sip');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'sip' as const, label: 'SIP Calculator', icon: 'fa-piggy-bank' },
          { key: 'emi' as const, label: 'EMI Calculator', icon: 'fa-money-bill' },
          { key: 'retirement' as const, label: 'Retirement', icon: 'fa-umbrella-beach' },
          { key: 'rentvsbuy' as const, label: 'Rent vs. Buy', icon: 'fa-house-chimney' },
        ].map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCalc(c.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCalc === c.key ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className={`fas ${c.icon} mr-2`} /> {c.label}
          </button>
        ))}
      </div>

      {activeCalc === 'sip' && <SIPCalculator />}
      {activeCalc === 'emi' && <EMICalculator />}
      {activeCalc === 'retirement' && <RetirementCalculator />}
      {activeCalc === 'rentvsbuy' && <RentVsBuyCalculator />}
    </div>
  );
}

function SIPCalculator() {
  const [monthly, setMonthly] = useState(15000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const invested = monthly * months;
  const gains = futureValue - invested;

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 mb-4">SIP Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-600 block mb-1">Monthly Investment</label>
          <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Duration (Years)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Expected Return (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Invested</p>
          <p className="font-bold text-slate-800">₹{invested.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4">
          <p className="text-xs text-emerald-600 mb-1">Est. Returns</p>
          <p className="font-bold text-emerald-700">₹{gains.toLocaleString()}</p>
        </div>
        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-xs text-primary mb-1">Total Value</p>
          <p className="font-bold text-primary">₹{Math.round(futureValue).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function EMICalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);

  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayable = emi * months;
  const interest = totalPayable - principal;

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 mb-4">EMI Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-600 block mb-1">Loan Amount</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Tenure (Years)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-xs text-primary mb-1">Monthly EMI</p>
          <p className="font-bold text-primary">₹{Math.round(emi).toLocaleString()}</p>
        </div>
        <div className="bg-rose-50 rounded-lg p-4">
          <p className="text-xs text-rose-600 mb-1">Total Interest</p>
          <p className="font-bold text-rose-700">₹{Math.round(interest).toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Total Payable</p>
          <p className="font-bold text-slate-800">₹{Math.round(totalPayable).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);

  const years = retireAge - currentAge;
  const futureMonthly = monthlyExpense * Math.pow(1 + inflation / 100, years);
  const corpusNeeded = futureMonthly * 12 * 25; // 25x rule

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-800 mb-4">Retirement Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-600 block mb-1">Current Age</label>
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Retirement Age</label>
          <input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Monthly Expense (Today)</label>
          <input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-slate-600 block mb-1">Inflation (%)</label>
          <input type="number" step="0.5" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-amber-50 rounded-lg p-4">
          <p className="text-xs text-amber-600 mb-1">Future Monthly Expense</p>
          <p className="font-bold text-amber-700">₹{Math.round(futureMonthly).toLocaleString()}</p>
        </div>
        <div className="bg-primary/5 rounded-lg p-4">
          <p className="text-xs text-primary mb-1">Corpus Needed (25x)</p>
          <p className="font-bold text-primary">₹{Math.round(corpusNeeded).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
