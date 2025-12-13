import { useState } from 'react';
import { UserPlus, CreditCard } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../api/axios';
import { API_ROUTES, GENDER_OPTIONS, PAYMENT_TYPES, CARD_STATUS } from '../../utils/constants';
import { validatePatientForm, hasErrors } from '../../utils/validators';
import { generatePatientId, generateCardNumber, getCardExpiryDate, formatForAPI } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function RegisterPatient() {
    const [formData, setFormData] = useState({
        // Patient fields
        patient_id: generatePatientId(),
        FirstName: '',
        Father_Name: '',
        GrandFather_Name: '',
        DateOfBirth: '',
        Age: '',
        Sex: '',
        Region: '',
        Wereda: '',
        HouseNo: '',
        PhoneNo: '',
        date_registered: formatForAPI(new Date()),
        // Card fields
        CardNumber: generateCardNumber(),
        issue_date: formatForAPI(new Date()),
        expire_date: formatForAPI(getCardExpiryDate()),
        // Payment
        amount: 100, // Default card fee
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validatePatientForm(formData);
        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // 1. Create patient
            await api.post(API_ROUTES.PATIENTS, {
                patient_id: formData.patient_id,
                FirstName: formData.FirstName,
                Father_Name: formData.Father_Name,
                GrandFather_Name: formData.GrandFather_Name,
                DateOfBirth: formData.DateOfBirth,
                Age: formData.Age ? parseInt(formData.Age) : null,
                Sex: formData.Sex,
                Region: formData.Region,
                Wereda: formData.Wereda,
                HouseNo: formData.HouseNo,
                PhoneNo: formData.PhoneNo,
                date_registered: formData.date_registered,
            });

            // 2. Create card
            await api.post(API_ROUTES.CARDS, {
                patient_id: formData.patient_id,
                CardNumber: formData.CardNumber,
                status: CARD_STATUS.ACTIVE,
                issue_date: formData.issue_date,
                expire_date: formData.expire_date,
            });

            // 3. Record payment
            await api.post(API_ROUTES.PAYMENTS, {
                card_id: null, // Will be updated after getting card_id
                amount: formData.amount,
                billing_date: new Date().toISOString(),
                description: 'New patient registration and card fee',
                payment_type: PAYMENT_TYPES.CARD_REGISTRATION,
                status: 'paid',
            });

            toast.success('Patient registered successfully!');

            // Reset form
            setFormData({
                patient_id: generatePatientId(),
                FirstName: '',
                Father_Name: '',
                GrandFather_Name: '',
                DateOfBirth: '',
                Age: '',
                Sex: '',
                Region: '',
                Wereda: '',
                HouseNo: '',
                PhoneNo: '',
                date_registered: formatForAPI(new Date()),
                CardNumber: generateCardNumber(),
                issue_date: formatForAPI(new Date()),
                expire_date: formatForAPI(getCardExpiryDate()),
                amount: 100,
            });
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Register New Patient</h1>
                <p className="text-gray-500 mt-1">Fill in patient information and generate card</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Patient Information" icon={UserPlus}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            error={errors.FirstName}
                            required
                        />
                        <Input
                            label="Father's Name"
                            name="Father_Name"
                            value={formData.Father_Name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Grandfather's Name"
                            name="GrandFather_Name"
                            value={formData.GrandFather_Name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Date of Birth"
                            name="DateOfBirth"
                            type="date"
                            value={formData.DateOfBirth}
                            onChange={handleChange}
                            error={errors.DateOfBirth}
                            required
                        />
                        <Input
                            label="Age"
                            name="Age"
                            type="number"
                            value={formData.Age}
                            onChange={handleChange}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="Sex"
                                value={formData.Sex}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select Gender</option>
                                {GENDER_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {errors.Sex && <p className="mt-1 text-sm text-red-600">{errors.Sex}</p>}
                        </div>
                        <Input
                            label="Region"
                            name="Region"
                            value={formData.Region}
                            onChange={handleChange}
                        />
                        <Input
                            label="Wereda"
                            name="Wereda"
                            value={formData.Wereda}
                            onChange={handleChange}
                        />
                        <Input
                            label="House Number"
                            name="HouseNo"
                            value={formData.HouseNo}
                            onChange={handleChange}
                        />
                        <Input
                            label="Phone Number"
                            name="PhoneNo"
                            value={formData.PhoneNo}
                            onChange={handleChange}
                            error={errors.PhoneNo}
                        />
                    </div>
                </Card>

                <Card title="Card Information" icon={CreditCard}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Card Number"
                            name="CardNumber"
                            value={formData.CardNumber}
                            disabled
                        />
                        <Input
                            label="Issue Date"
                            name="issue_date"
                            type="date"
                            value={formData.issue_date}
                            disabled
                        />
                        <Input
                            label="Expiry Date"
                            name="expire_date"
                            type="date"
                            value={formData.expire_date}
                            disabled
                        />
                        <Input
                            label="Card Fee (ETB)"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register Patient'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
