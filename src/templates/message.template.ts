export const ContactMessageTemplate = (data: {
  imgUrl: string;
  locationName: string;
  locationPrice: any;
  locationPriceUnit: string;
  typeName: string;
}) => `
<div style="
  font-family: 'Segoe UI', system-ui, sans-serif;
  max-width: 280px;
  background: #ffffff;
  border-radius: 12px 12px 12px 2px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  border: 1px solid #e8e8e8;
">

  <!-- Header -->
  <div style="
    background: #f0f4ff;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #e0e8ff;
  ">
    <span style="font-size: 16px;">🤝</span>
    <span style="
      font-size: 13px;
      font-weight: 700;
      color: #1a73e8;
    ">
      Yêu cầu liên hệ tư vấn
    </span>
  </div>

  <!-- Image -->
  <div style="width: 100%; height: 140px; position: relative; overflow: hidden;">
    <img
      src="https://cafefcdn.com/203337114487263232/2024/11/26/46826586011156477472353227663679545028498852n-1732612272499-17326122727241511362724.jpg"
      alt="Nhà ở"
      style="width: 100%; height: 100%; object-fit: cover; display: block;"
    />

    <!-- Tag -->
    <span style="
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0,0,0,0.55);
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 10px;
    ">
      ${data.typeName}
    </span>
  </div>

  <!-- Content -->
  <div style="padding: 12px 14px;">

    <!-- Title -->
    <div style="
      font-size: 14px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    ">
      ${data.locationName}
    </div>

    <!-- Price -->
    <div style="
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      margin-bottom: 10px;
    ">
      <span style="color: #e65100; font-weight: 700;">
        ${Number(data.locationPrice).toLocaleString('vi-VN')}đ
      </span>
      <span style="color: #aaa; font-size: 11px;">
        ${data.locationPriceUnit}
      </span>
    </div>

    <!-- Description -->
    <p style="
      margin: 0;
      font-size: 13px;
      color: #444;
      line-height: 1.55;
    ">
      Tôi quan tâm đến địa điểm này, vui lòng liên hệ tư vấn giúp tôi. Cảm ơn!
    </p>

  </div>

</div>
`;

export const RentLocationMessageTemplate = (data: {
  imgUrl: string;
  locationName: string;
  locationPrice: any;
  locationPriceUnit: string;
  typeName: string;
  time: string;
}) => `
<div style="
  font-family: 'Segoe UI', system-ui, sans-serif;
  max-width: 280px;
  background: #ffffff;
  border-radius: 12px 12px 12px 2px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  border: 1px solid #e8e8e8;
">

  <!-- Header -->
  <div style="
    padding: 10px 14px;
    background: #f0f4ff;
    border-bottom: 1px solid #e0e8ff;
    display: flex;
    align-items: center;
    gap: 8px;
  ">
    <span style="font-size: 15px;">📍</span>
    <span style="
      font-size: 13px;
      font-weight: 700;
      color: #1a73e8;
    ">
      Quan tâm địa điểm thuê
    </span>
  </div>

  <!-- Image -->
  <div style="width: 100%; height: 140px; overflow: hidden; position: relative;">
    <img
      src="${data.imgUrl || 'https://via.placeholder.com/300x140'}"
      alt="${data.locationName || 'location'}"
      style="width: 100%; height: 100%; object-fit: cover; display: block;"
    />
    <span style="
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0,0,0,0.55);
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 10px;
    ">
      ${data.typeName || ''}
    </span>
  </div>

  <!-- Body -->
  <div style="padding: 10px 14px 8px;">
    <div style="
      font-size: 14px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    ">
      ${data.locationName || 'Không có tên'}
    </div>

    <div style="
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    ">
      <span style="color: #e65100; font-weight: 700;">
       ${Number(data.locationPrice).toLocaleString('vi-VN')}đ/
      </span>
      <span style="color: #aaa; font-size: 11px;">
        ${data.locationPriceUnit}
      </span>
    </div>
  </div>

  <!-- Footer -->
  <div style="
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  ">
    <span style="font-size: 11px; color: #bbb;">
      Gửi lúc ${data.time || ''}
    </span>

    <span style="
      font-size: 11px;
      font-weight: 600;
      color: #f57c00;
      background: #fff3e0;
      padding: 3px 8px;
      border-radius: 10px;
    ">
      Chờ tư vấn
    </span>
  </div>

</div>
`;
