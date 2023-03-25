import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Select, Stack, TextInput, Button, Group, Progress } from "@mantine/core";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { fireDb, storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { showNotification } from "@mantine/notifications";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import moment from "moment";

function SliderForm({
  formMode,
  setFormMode,
  setShowForm,
  sliderData,
  getData,
}) {
  const dispatch = useDispatch();

  const slider = JSON.parse(localStorage.getItem("banner"));


  const sliderForm = useForm({
    initialValues: {
      active: null,
      bannerURL: "",
      addedDate: null,
      validationDate: null,
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(ShowLoading());
      if(formMode === "add") 
      {
        const addc = await addDoc(
          collection(fireDb, `banner`),
          {
            active: sliderForm.values.active,
            bannerURL: sliderForm.values.bannerURL,
            addedDate: sliderForm.values.addedDate,
            validationDate: sliderForm.values.validationDate,
          });

          await updateDoc(doc(fireDb, `banner`, addc.id), {
            id: addc.id,
          });
      }else{
        await setDoc(
          doc(fireDb, `banner`, sliderData.id),
          sliderForm.values,
        );
      }
    
      showNotification({
        title: formMode === "add" ? "Slider Eklendi" : "Slider Güncellendi",
        color: "green",
      });
      dispatch(HideLoading());
      getData()
      setShowForm(false);
    } catch (error) {
      showNotification({
        title: formMode === "add" ? "Slider eklenirken hata oluştu" : "Slider güncellenirken hata oluştu",
        color: "red",
      });
      dispatch(HideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    if (formMode === "edit") {
      sliderForm.setValues(sliderData);
      sliderForm.setFieldValue('addedDate', new Date(moment(sliderData.addedDate.toDate().toISOString()).format('DD-MM-YYYY')));
      sliderForm.setFieldValue('validationDate', new Date(moment(sliderData.validationDate.toDate().toISOString()).format('DD-MM-YYYY')));
    } else {
      sliderForm.setValues()
    }
  }, [sliderData]);

  function hasVal(sliderData){
    if(sliderData.addedDate != null){
      return moment(sliderData.addedDate.toDate()).format('YYYY-MM-DD')
    }else{
      return null;
    }
  }

  function hasValFinish(sliderData){
    if(sliderData.validationDate != null){
      return moment(sliderData.validationDate.toDate()).format('YYYY-MM-DD')
    }else{
      return null;
    }
  }


  // upload section
  const [file, setFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  }
  const handleUpload = () => { 
    if(uploadProgress !== 100){ 
      dispatch(ShowLoading());
    }
    if(file === ""){
      showNotification({
        title: "Lütfen Bir Resim Seçin",
        color: "red",
      });
    }
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(progress);
    }, (error) => {
      console.log(error);
    }, () => {
      dispatch(HideLoading());

      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        sliderForm.setFieldValue('bannerURL', downloadURL);
        const imageStoreRef = doc(fireDb, `banner`, sliderData.id);
        if(formMode === "add") 
      {
        addDoc(
          imageStoreRef, {
            bannerURL: downloadURL,
          }
        );
      }
      });
    });
  }
  
  const isDisabled = (props) => { 
    let process = uploadProgress;
    if (formMode === "add") {
      if(process !== 100){
        return true;
      } else {
        return false;
      }
    }   
  }
  
  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        <Stack>
        <Group position="apart" grow>
            <Select required
              name="active"
              label="Aktif/Pasif"
              placeholder="Aktif/Pasif"
              data={[
                { label: "Aktif", value: true },
                { label: "Pasif", value: false },
              ]}
              {...sliderForm.getInputProps("active")}
            />
          </Group>
          <Group grow>
          <TextInput required
              name="date"
              label="Başlangıç Tarihi"
              type="date"
              placeholder="Başlangıç tarihini giriniz"
              defaultValue={hasVal(sliderData)}
              onChange={(e) => sliderForm.setFieldValue('addedDate', new Date(moment(e.target.value).format('LLL')))}
            />
            <TextInput required
              name="date"
              label="Bitiş Tarihi"
              type="date"
              placeholder="Bitiş tarihini giriniz"
              defaultValue={hasValFinish(sliderData)}
              onChange={(e) => sliderForm.setFieldValue('validationDate', new Date(moment(e.target.value).format('LLL')))}
            />
          </Group> 
          <div>
            <input
              type="file"
              accept="image/*"
              label="Resim Yükle" 
              placeholder="Resim Yükle"
              onChange={handleChange}
            />
           <Button onClick={handleUpload}>Resim Yükle</Button>
          </div> 
          <Button disabled={isDisabled()} color="cyan" type="submit">
            {formMode === "add" ? "Banner'i Ekle " : "Banner'i Güncelle"}
          </Button>
        </Stack >
      </form>
      
    </div>
  );
}

export default SliderForm;
