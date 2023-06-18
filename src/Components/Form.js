import React, { useState } from 'react';
import './Form.css';
import { Modal } from 'antd';


const Form = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    gender: '',
    birthday: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'idCard') {
      const formattedIdCard = formatIdCard(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedIdCard,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      idCard: '',
      gender: '',
      birthday: '',
    });
    setInvalidFields([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { fullName, idCard, gender, birthday } = formData;
    const isThaiName = /^[ก-๏\s]+$/u.test(fullName);
    const isEnglishName = /^[A-Za-z\s]+$/.test(fullName);
    const idCardRegex = /^\d{1}-\d{4}-\d{5}-\d{2}-\d{1}$/;

    let invalidFields = [];

    if (fullName === '') {
      invalidFields.push('fullName');
    } else if (!isThaiName && !isEnglishName) {
      invalidFields.push('fullNameLg');
    }

    if (idCard === '') {
      invalidFields.push('idCard');
    } else if (!idCardRegex.test(idCard)) {
      invalidFields.push('idCardNum');
    }

    if (gender === '') {
      invalidFields.push('gender');
    }

    if (birthday === '') {
      invalidFields.push('birthday');
    }

    setInvalidFields(invalidFields);
    if (invalidFields.length === 0) {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalCloseReset = () => {
    setShowModal(false);
    setFormData({
      fullName: '',
      idCard: '',
      gender: '',
      birthday: '',
    });
    setInvalidFields([]);
  };

  const formatIdCard = (idCard) => {
    const numericOnly = idCard.replace(/\D/g, '');
    const parts = [];
    parts.push(numericOnly.substr(0, 1));
    parts.push(numericOnly.substr(1, 4));
    parts.push(numericOnly.substr(5, 5));
    parts.push(numericOnly.substr(10, 2));
    parts.push(numericOnly.substr(12, 1));
    return parts.join('-');
  };

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    return age * 12 + months;
  };

  const isEligibleForService = (birthday) => {
    const ageInMonths = calculateAge(birthday);
    const age = ageInMonths / 12;

    return age >= 65 || (age >= 0.5 && age <= 2);
  };

  return (
    <div>
      <h1>ฟอร์มการลงทะเบียนกิจกรรมฉีดวัคซีนโควิด-19</h1>
      <h3>
        กิจกรรมการฉีดวัคซีนป้องกันโควิด 19 เปิดให้ผู้รับบริการสามารถเข้ารับบริการฉีดวัคซีน
        ในวันที่ 1 มิถุนายน พ.ศ. 2566 – 31 สิงหาคม พ.ศ. 2566 โดยมีเงื่อนไขการเข้ารับวัคซีน ดังนี้
      </h3>
      <h3>1. ผู้สูงอายุ 65 ปีขึ้นไป (ชาย,หญิง)</h3>
      <h3>2. เด็กที่มีอายุระหว่าง 6 เดือน ถึง 2 ปี (ชาย,หญิง)</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">ชื่อ-นามสกุล:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {invalidFields.includes('fullName') && (
            <p className="error-message">กรุณากรอกชื่อ-นามสกุล</p>
          )}
          {invalidFields.includes('fullNameLg') && (
            <p className="error-message">กรุณากรอกชื่อ-นามสกุลเป็นภาษาไทยหรือภาษาอังกฤษเท่านั้น</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="idCard">หมายเลขบัตรประชาชน:</label>
          <input
            type="text"
            id="idCard"
            name="idCard"
            value={formData.idCard}
            onChange={handleChange}
          />
          {invalidFields.includes('idCard') && (
            <p className="error-message">กรุณากรอกหมายเลขบัตรประชาชน</p>
          )}
          {invalidFields.includes('idCardNum') && (
            <p className="error-message">กรุณากรอกหมายเลขบัตรประชาชนให้ครบ 13 หลัก</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">เพศ:</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">โปรดเลือก</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
          {invalidFields.includes('gender') && (
            <p className="error-message">กรุณาเลือกเพศ</p>
          )}
        </div>
            
        <div className="form-group">
          <label htmlFor="birthday">วันเกิด:</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
          />
          {invalidFields.includes('birthday') && (
            <p className="error-message">กรุณากรอกวัน/เดือน/ปีเกิด</p>
          )}
        </div>

        <div className="button-group">
          <button className="confirm" type="submit">
            ยืนยัน
          </button>
          <button className="clear" type="button" onClick={handleReset}>
            ล้างค่า
          </button>
        </div>
      </form>

      <Modal
        visible={showModal}
        onCancel={handleModalClose}
        closable={false}
        footer={[
          <button key="ok" className="btn-ok" onClick={handleModalCloseReset}>
            ย้อนกลับ
          </button>,
        ]}
      >
        <h2>สถานะการเข้ารับบริการ</h2>
        <p>ชื่อ-สกุล: {formData.fullName}</p>
        <p>เพศ: {formData.gender}</p>
        <p>
          เกิด{new Date(formData.birthday).toLocaleDateString('th-TH', { weekday: 'long' })}ที่{' '}
          {new Date(formData.birthday).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            era: 'short',
          })}
        </p>
        {isEligibleForService(formData.birthday) ? (
          <p style={{ color: 'green' }}>สามารถเข้ารับบริการได้</p>
        ) : (
          <p style={{ color: 'red' }}>ไม่สามารถเข้ารับบริการได้</p>
        )}
      </Modal>
    </div>
  );
};

export default Form;
