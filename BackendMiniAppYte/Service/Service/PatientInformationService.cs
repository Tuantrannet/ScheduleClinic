using AutoMapper;
using Backend.DTO.Request;
using Backend.DTO.Respond;
using Backend.Enities;
using Backend.Repositories.Interface;
using Backend.Service.IService;
using Microsoft.EntityFrameworkCore.Update.Internal;

namespace Backend.Service.Service
{
    public class PatientInformationService : IPatientInformationService
    {
        private readonly IPatientInformationRepo patientInformationRepo;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;

        public PatientInformationService(IPatientInformationRepo patientInformationRepo, IMapper mapper
            ,IUnitOfWork unitOfWork)
        {
            this.patientInformationRepo = patientInformationRepo;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
        }

        public async Task CreateAsync(CreatePatientRequestDto request, string zaloid)
        {
            var newPatient = new PatientInformation
            {
                ZaloId = zaloid, // Gán ZaloId từ token vào đây để Entity hợp lệ
                PatientName = request.PatientName,
                Gender = request.Gender,
                Birthday = request.Birthday,
                PhoneNumber = request.PhoneNumber,
                CCCD = request.CCCD
            };
            await patientInformationRepo.AddAsync(newPatient);

            await unitOfWork.SaveChanges();
        }

        public async Task<CreatePatientRequestDto?> UpdateAsync(string zaloid ,CreatePatientRequestDto request)
        {

            var newPatient = new PatientInformation
            {
                ZaloId = zaloid, // Gán ZaloId từ token vào đây để Entity hợp lệ
                PatientName = request.PatientName,
                Gender = request.Gender,
                Birthday = request.Birthday,
                PhoneNumber = request.PhoneNumber,
                CCCD = request.CCCD
            };
            var affect = await patientInformationRepo.UpdateAsync(zaloid, newPatient);

            if (affect == false)
            {
             throw new KeyNotFoundException("Not find data to update");
            }

            return request;
        }

        public async Task DeleteAsync(string Id)
        {
            var affect = await patientInformationRepo.DeleteAsync(Id);
            if(affect == false)
            {
                throw new KeyNotFoundException("Not find data to Delete");
            }
        }

        public async Task<PatientInfoDto?> GetInformationByIdAsync(string Id)
        {
            var patientInformation = await patientInformationRepo.GetByIdAsync(Id);

            if (patientInformation == null)
            {
                throw new KeyNotFoundException("Not find data");
            }

            var patientInfoDto = mapper.Map<PatientInfoDto>(patientInformation);
            return patientInfoDto;
        }

        public async Task<bool> CheckZaloIdAsync(string zaloId)
        {
            var check = await patientInformationRepo.ExistsAsync(zaloId);
            return check;
        }
    }
}
