import { Context, DAL, ModulesSdkTypes } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import {
  DeliveryDTO,
  DriverDTO,
  DeliveryDriverDTO,
} from "../../types/delivery/common"
import {
  CreateDeliveryDTO,
  CreateDriverDTO,
  UpdateDeliveryDTO,
  UpdateDriverDTO,
  CreateDeliveryDriverDTO,
} from "../../types/delivery/mutations"
import { Delivery, Driver, DeliveryDriver } from "./models"

const generateMethodForModels = [Delivery, Driver, DeliveryDriver]

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  deliveryService: ModulesSdkTypes.InternalModuleService<any>
  driverService: ModulesSdkTypes.InternalModuleService<any>
  deliveryDriverService: ModulesSdkTypes.InternalModuleService<any>
}

export default class DeliveryModuleService<
  TEntity extends Delivery = Delivery,
  TDriver extends Driver = Driver,
  TDeliveryDriver extends DeliveryDriver = DeliveryDriver,
> extends ModulesSdkUtils.abstractModuleServiceFactory<
  InjectedDependencies,
  DeliveryDTO,
  {
    Delivery: { dto: DeliveryDTO }
    Driver: { dto: DriverDTO }
    DeliveryDriver: { dto: DeliveryDriverDTO }
  }
>(Delivery, generateMethodForModels, {}) {
  protected baseRepository_: DAL.RepositoryService
  protected readonly deliveryService_: ModulesSdkTypes.InternalModuleService<TEntity>
  protected readonly driverService_: ModulesSdkTypes.InternalModuleService<TDriver>
  protected readonly deliveryDriverService_: ModulesSdkTypes.InternalModuleService<TDeliveryDriver>

  constructor({
    baseRepository,
    deliveryService,
    driverService,
    deliveryDriverService,
  }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.baseRepository_ = baseRepository
    this.deliveryService_ = deliveryService
    this.driverService_ = driverService
    this.deliveryDriverService_ = deliveryDriverService
  }

  @InjectTransactionManager("baseRepository_")
  async createDelivery(
    data: CreateDeliveryDTO,
    @MedusaContext() context: Context = {}
  ): Promise<Delivery> {
    const delivery = this.deliveryService_.create(data, context)
    return this.baseRepository_.serialize<Delivery>(delivery, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async updateDelivery(
    deliveryId: string,
    data: UpdateDeliveryDTO,
    @MedusaContext() context: Context = {}
  ): Promise<DeliveryDTO> {
    const updatedDelivery = await this.deliveryService_.update({
      id: deliveryId,
      ...data,
    })

    const serializedResponse =
      await this.baseRepository_.serialize<DeliveryDTO>(updatedDelivery, {
        populate: true,
      })

    return serializedResponse[0]
  }

  @InjectTransactionManager("baseRepository_")
  async deleteDelivery(
    deliveryId: string,
    @MedusaContext() context: Context = {}
  ) {
    await this.deliveryService_.delete(deliveryId)
  }

  @InjectTransactionManager("baseRepository_")
  async createDriver(
    data: CreateDriverDTO,
    @MedusaContext() context: Context = {}
  ): Promise<DriverDTO> {
    const driver = this.driverService_.create(data, context)
    return this.baseRepository_.serialize<DriverDTO>(driver, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async updateDriver(
    driverId: string,
    data: UpdateDriverDTO,
    @MedusaContext() context: Context = {}
  ): Promise<DriverDTO> {
    const updatedDriver = await this.driverService_.update({
      id: driverId,
      ...data,
    })

    return this.baseRepository_.serialize<DriverDTO>(updatedDriver, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async deleteDriver(driverId: string, @MedusaContext() context: Context = {}) {
    await this.driverService_.delete(driverId)
  }

  @InjectTransactionManager("baseRepository_")
  async createDeliveryDriver(
    deliveryId: string,
    driverId: string,
    @MedusaContext() context: Context = {}
  ): Promise<DeliveryDriverDTO> {
    const deliveryDriver = this.deliveryDriverService_.create(
      {
        delivery_id: deliveryId,
        driver_id: driverId,
      },
      context
    )
    return this.baseRepository_.serialize<DeliveryDriverDTO>(deliveryDriver, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async deleteDeliveryDriver(
    data: Partial<CreateDeliveryDriverDTO>,
    @MedusaContext() context: Context = {}
  ) {
    await this.deliveryDriverService_.delete(data)
  }
}