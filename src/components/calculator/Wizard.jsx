import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Star, UploadCloud, ImageIcon, X } from 'lucide-react';

const Wizard = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        "Body Type": "Normal",
        "Sex": "Female",
        "Diet": "Omnivore",
        "Transport": "Public Transport",
        "Vehicle Type": "Petrol",
        "Vehicle Monthly Distance Km": 0,
        "Frequency of Traveling by Air": "Rarely",
        "Monthly Grocery Bill": 150,
        "How Many New Clothes Monthly": 2,
        "Heating Energy Source": "Electricity",
        "Energy efficiency": "Yes",
        "How Often Shower": "Daily",
        "How Long TV PC Daily Hour": 4,
        "How Long Internet Daily Hour": 4,
        "Waste Bag Size": "Medium",
        "Waste Bag Weekly Count": 2,
        "Recycling": [],
        "Cooking_With": [],
        "WasteImage": null
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleMultiSelect = (name, val) => {
        setFormData(prev => {
            const arr = prev[name];
            if (arr.includes(val)) {
                return { ...prev, [name]: arr.filter(i => i !== val) };
            } else {
                return { ...prev, [name]: [...arr, val] };
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, "WasteImage": file }));
        }
    };

    const removeFile = () => {
        setFormData(prev => ({ ...prev, "WasteImage": null }));
    };

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
        else onComplete(formData);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // UI Components mapping
    const inputClass = "w-full bg-[#0b1020] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-accent)] focus:ring-1 focus:ring-[var(--color-brand-accent)] transition-all";
    const labelClass = "block text-sm font-medium text-[var(--color-brand-text-secondary)] mb-2";

    return (
        <div className="w-full bg-[var(--color-brand-surface)] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#0b1020] rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[var(--color-brand-accent)] to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Transport & Travel"}
                    {step === 3 && "Consumption"}
                    {step === 4 && "Energy & Waste"}
                    {step === 5 && "Waste Vision AI"}
                </h2>
                <span className="text-[var(--color-brand-accent)] font-medium">Step {step} of {totalSteps}</span>
            </div>

            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* --- STEP 1: PERSONAL --- */}
                        {step === 1 && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* <div className="md:col-span-2 bg-[#0b1020]/50 p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3">
                                    <Star className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-emerald-200/80">Transport choices have a <strong>High Impact</strong> on your carbon footprint. Accuracy here ensures better predictions.</p>
                                </div> */}
                                <div>
                                    <label className={labelClass}>Body Type</label>
                                    <select name="Body Type" value={formData["Body Type"]} onChange={handleChange} className={inputClass}>
                                        <option value="underweight">Underweight</option>
                                        <option value="normal">Normal</option>
                                        <option value="overweight">Overweight</option>
                                        <option value="obese">Obese</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Sex</label>
                                    <select name="Sex" value={formData["Sex"]} onChange={handleChange} className={inputClass}>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Diet</label>
                                    <select name="Diet" value={formData["Diet"]} onChange={handleChange} className={inputClass}>
                                        <option value="vegan">Vegan</option>
                                        <option value="vegetarian">Vegetarian</option>
                                        <option value="pescatarian">Pescatarian</option>
                                        <option value="omnivore">Omnivore</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 2: TRANSPORT (HIGH IMPACT) --- */}
                        {step === 2 && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 bg-[#0b1020]/50 p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3">
                                    <Star className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-emerald-200/80">Transport choices have a <strong>High Impact</strong> on your carbon footprint. Accuracy here ensures better predictions.</p>
                                </div>

                                <div>
                                    <label className={labelClass}>Primary Transport Type</label>
                                    <select name="Transport" value={formData["Transport"]} onChange={handleChange} className={inputClass}>
                                        <option value="walk/bicycle">Walk/Bicycle</option>
                                        <option value="public">Public Transport</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                {formData["Transport"] === "private" && (
                                    <div>
                                        <label className={labelClass}>Vehicle Type</label>
                                        <select name="Vehicle Type" value={formData["Vehicle Type"]} onChange={handleChange} className={inputClass}>
                                            <option value="electric">Electric</option>
                                            <option value="hybrid">Hybrid</option>
                                            <option value="petrol">Petrol</option>
                                            <option value="diesel">Diesel</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className={labelClass}>Vehicle Monthly Distance (Km)</label>
                                    <input type="number" name="Vehicle Monthly Distance Km" value={formData["Vehicle Monthly Distance Km"]} onChange={handleChange} min="0" className={inputClass} placeholder="e.g. 500" />
                                </div>

                                <div>
                                    <label className={labelClass}>Frequency of Traveling by Air</label>
                                    <select name="Frequency of Traveling by Air" value={formData["Frequency of Traveling by Air"]} onChange={handleChange} className={inputClass}>
                                        <option value="never">Never</option>
                                        <option value="rarely">Rarely</option>
                                        <option value="frequently">Frequently</option>
                                        <option value="very frequently">Very Frequently</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* --- STEP 3: CONSUMPTION --- */}
                        {step === 3 && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Monthly Grocery Bill ($)</label>
                                    <input type="number" name="Monthly Grocery Bill" value={formData["Monthly Grocery Bill"]} onChange={handleChange} min="0" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>New Clothes Monthly</label>
                                    <input type="number" name="How Many New Clothes Monthly" value={formData["How Many New Clothes Monthly"]} onChange={handleChange} min="0" className={inputClass} />
                                </div>
                            </div>
                        )}

                        {/* --- STEP 4: ENERGY & WASTE --- */}
                        {step === 4 && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Heating Energy Source</label>
                                    <select name="Heating Energy Source" value={formData["Heating Energy Source"]} onChange={handleChange} className={inputClass}>
                                        <option value="electricity">Electricity</option>
                                        <option value="natural gas">Natural Gas</option>
                                        <option value="wood">Wood</option>
                                        <option value="coal">Coal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Energy Efficiency Rating</label>
                                    <select name="Energy efficiency" value={formData["Energy efficiency"]} onChange={handleChange} className={inputClass}>
                                        <option value="Yes">Yes (High)</option>
                                        <option value="Sometimes">Sometimes</option>
                                        <option value="No">No (Low)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Waste Bag Size</label>
                                    <select name="Waste Bag Size" value={formData["Waste Bag Size"]} onChange={handleChange} className={inputClass}>
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                        <option value="extra large">Extra Large</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Waste Bag Weekly Count</label>
                                    <input type="number" name="Waste Bag Weekly Count" value={formData["Waste Bag Weekly Count"]} onChange={handleChange} min="0" className={inputClass} />
                                </div>

                                <div>
                                    <label className={labelClass}>How Often Shower</label>
                                    <select name="How Often Shower" value={formData["How Often Shower"]} onChange={handleChange} className={inputClass}>
                                        <option value="less frequently">Less Frequently</option>
                                        <option value="daily">Daily</option>
                                        <option value="twice a day">Twice a Day</option>
                                        <option value="more frequently">More Frequently</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>Recycling Practices (Select all that apply)</label>
                                    <div className="flex flex-wrap gap-3">
                                        {["Paper", "Plastic", "Glass", "Metal"].map(item => (
                                            <button
                                                key={item}
                                                onClick={() => handleMultiSelect("Recycling", item)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData["Recycling"].includes(item) ? 'bg-[var(--color-brand-accent)] text-white' : 'bg-[#0b1020] text-gray-400 hover:bg-white/10'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>Cooking Methods (Select all that apply)</label>
                                    <div className="flex flex-wrap gap-3">
                                        {["Stove", "Oven", "Microwave", "Grill", "Airfryer"].map(item => (
                                            <button
                                                key={item}
                                                onClick={() => handleMultiSelect("Cooking_With", item)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData["Cooking_With"].includes(item) ? 'bg-[var(--color-brand-accent)] text-white' : 'bg-[#0b1020] text-gray-400 hover:bg-white/10'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* --- STEP 5: COMPUTER VISION AI --- */}
                        {step === 5 && (
                            <div className="flex flex-col items-center justify-center space-y-6 py-4">
                                <div className="text-center max-w-md">
                                    <h3 className="text-xl font-bold text-white mb-2">Upload Waste Image</h3>
                                    <p className="text-[var(--color-brand-text-secondary)] text-sm mb-6">Take a picture of today's waste bin. Our YOLO Vision Model will detect materials (plastic, cardboard) and calculate exact carbon impact.</p>
                                </div>

                                <div className="w-full max-w-lg">
                                    {!formData["WasteImage"] ? (
                                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[var(--color-brand-accent)]/40 rounded-2xl cursor-pointer bg-[var(--color-brand-bg)] hover:bg-[var(--color-brand-accent)]/5 hover:border-[var(--color-brand-accent)] transition-all group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-12 h-12 text-[var(--color-brand-accent)]/60 group-hover:text-[var(--color-brand-accent)] mb-4 transition-colors" />
                                                <p className="mb-2 text-sm text-gray-300"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative flex flex-col items-center justify-center w-full h-64 border border-white/10 rounded-2xl bg-[#0b1020] overflow-hidden group">
                                            <img
                                                src={URL.createObjectURL(formData["WasteImage"])}
                                                alt="Waste preview"
                                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                                            />
                                            <div className="relative z-10 flex flex-col items-center bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                                <ImageIcon className="w-8 h-8 text-[var(--color-brand-accent)] mb-2" />
                                                <span className="text-white font-medium truncate max-w-[200px]">{formData["WasteImage"].name}</span>
                                                <span className="text-xs text-emerald-400 mt-1">Ready for YOLO Analysis</span>
                                            </div>

                                            <button
                                                onClick={removeFile}
                                                className="absolute top-4 right-4 p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-10 flex flex-col-reverse sm:flex-row border-t border-white/10 pt-6 justify-between items-center gap-4">
                <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-[var(--color-brand-text-secondary)] hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <button
                    onClick={nextStep}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 bg-[var(--color-brand-accent)] text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all"
                >
                    {step === totalSteps ? 'Calculate Footprint' : 'Next Step'}
                    {step === totalSteps ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
            </div>

        </div>
    );
};

export default Wizard;
